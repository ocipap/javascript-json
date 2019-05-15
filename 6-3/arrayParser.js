const _ = require('./util')
const L = _.L
const c = require('./checker')
const Either = require('./Either')

const separator = [
    c.isRBracket,
    c.isLBracket,
    c.isLBrace,
    c.isRBrace,
    c.isColon
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
    c.isString
]

const isSeparator = _.checker(...separator)

const isOfferedType = _.checker(...offerdType)

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
    (c.isString(text) && _.counts(text, "'") > 2) ? Either.left(`${text}는(은) 올바른 문자열이 아닙니다.`) : Either.right(text)


const getType = text => {
    const [typeFunc] = _.findOne(f => f(text), offerdType)
    return Either.right({
        type: typeFunc.type,
        value: text,
        child: []
    })
}

const tokenizer = (str) => _.go(
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

const parser = () => {}

const ArrayParser = _.pipe(
    tokenizer,
    laxer,
    //parser
)


try {
    const str = "[123, {'hello': 'world'} 22, 33]";
    const result = ArrayParser(str);
} catch(e) {
    console.log(e.message)
}