const _ = require('./util')
const L = _.L
const c = require('./checker')
const Either = require('./Either')

const separator = [
    c.isRBracket,
    c.isLBracket,
    c.isLBrace,
    c.isRBrace,
    c.isColon,
]

const offerdType = [
    c.isRBracket,
    c.isLBracket,
    c.isLBrace,
    c.isRBrace,
    c.isColon,
    c.isNull,
    c.isBoolean,
    c.isNumber,
    c.isString,
    c.isComma
]



const isSeparator = _.checker(...separator)

const isOfferedType = _.checker(...offerdType)

const isValidString = text => c.isString(text) && _.counts(text, "'") > 2

const isValidParsedResult = res => !res || res.length

const tokenizerHelper = (arr, s) => {
    if (isSeparator(s)) {
        arr.push(s)
    } else if (c.isComma(s)) {
        arr.push("")
    } else {
        let last = _.last(arr)
        isSeparator(last) ? arr.push(s) : arr[arr.length - 1] = last.concat(s)
    }
    return arr
}

const checkType = text =>
    isOfferedType(text) ? Either.right(text) : Either.left(`${text}는(은) 알 수 없는 타입입니다.`)

const checkStringType = text =>
    !isValidString(text) ? Either.right(text) : Either.left(`${text}는(은) 올바른 문자열이 아닙니다.`)


const getType = text => {
    const [typeFunc] = _.findOne(f => f(text), offerdType)
    if (typeFunc.change) text = typeFunc.change(text)
    return Either.right({
        type: typeFunc.type,
        value: text,
    })
}

const parserHelper = (arr) => {
    let iter = arr[Symbol.iterator]()
    let firstCur = iter.next().value

    return Either.right((function recur(parent, t) {
        let cur = iter.next().value

        if (cur.type === "RBracket" || cur.type === "RBrace") return parent

        else if (cur.type === "array" || cur.type === "object") {
            parent.child.push(recur({
                type: cur.type,
                child: []
            }, cur.type))
            return recur(parent, t)
        } else if (t === "array") {
            parent.child.push(cur)
            return recur(parent, t);
        } else {
            let key = cur.value
            let colon = iter.next().value
            let value = iter.next().value
            let type = value.type

            if (type === "array" || type === "object") {
                value = recur({
                    type,
                    child: []
                }, type)
            } else {
                value = value.value
            }
            parent.child.push({
                key,
                type,
                value
            })
            return recur(parent, t);
        }
    })({
        type: firstCur.type,
        child: []
    }, firstCur.type))
}

const checkHelper = sep => (arr, el) => (!arr) ? false : (el === sep) ? (arr.push(el), arr) : (arr.length) ? (arr.pop(), arr) : false

const checkBraket = (arr) => {
    let result = _.reduce(checkHelper("["), [],
        _.go(
            arr,
            _.filter(v => v.type === "array" || v.type === "RBracket"),
            _.pluck('value'),
        ))
    return isValidParsedResult(result) ? Either.left(`정상적으로 종료되지 않은 배열이 있습니다.`) : Either.right(arr)
}

const checkBrace = (arr) => {
    let result = _.reduce(checkHelper("{"), [],
        _.go(
            arr,
            _.filter(v => v.type === "object" || v.type === "RBrace"),
            _.pluck('value'),
        ))
    return isValidParsedResult(result) ? Either.left(`정상적으로 종료되지 않은 객체가 있습니다.`) : Either.right(arr)
}

const tokenizer = str => _.go(
    _.reduce(tokenizerHelper, [], str),
    _.map(v => v.trim()),
    _.reject(v => v === "")
)

const laxer = _.map(v => {
    return Either.of(v)
        .chain(checkType)
        .chain(checkStringType)
        .chain(getType)
        .getOrElseThrow()
})

const parser = arr => {
    return Either.of(arr)
        .chain(checkBraket)
        .chain(checkBrace)
        .chain(parserHelper)
        .getOrElseThrow()
}

const ArrayParser = _.pipe(
    tokenizer,
    laxer,
    parser,
)

try {
    const str = "['1a3',[null,false,['11',[112233],{'easy' : ['hello', 'world']},112],55, '99'],{'a':'str', 'b':[912,[5656,33],{'key' : 'innervalue', 'newkeys': [1,2,3,4,5]}]}, true]";
    const result = ArrayParser(str);
    console.log(JSON.stringify(result, null, 2));
} catch (e) {
    console.log(e)
}