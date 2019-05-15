const _ = require('./util')
const L = _.L
const c = require('./checker')

const isSeparator = _.checker(
    c.isRBracket,
    c.isLBracket,
    c.isLBrace,
    c.isRBrace,
    c.isColon
)

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

const tokenizer = (str) => _.reduce(tokenizerHelper, [], str)

const laxer = (tokenedArr) => {}

const parser = () => {}

const ArrayParser = _.pipe(
    tokenizer,
    //laxer,
    //parser
)

const str = "[123, 22, 33]";
const result = ArrayParser(str);
//console.log(JSON.stringify(result, null, 2));