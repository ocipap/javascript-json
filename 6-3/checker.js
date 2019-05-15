const isLBracket = c => /\[/.test(c)
const isRBracket = c => /\]/.test(c)
const isLBrace = c => /[{]/.test(c)
const isRBrace = c => /[}]/.test(c)
const isComma = c => /,/.test(c)
const isColon = c => /:/.test(c)
const isNull = c => /null/.test(c)
const isBoolean = c => /true|false/.test(c)
const isNumber = c => /^[0-9]*$/.test(c)
const isString = c => /['][a-z0-9]*[']|["][a-z0-9]*["]/.test(c)
const toBoolean = text => text === "true" ? true : false
const toNumber = text => Number(text)
const toNull = _ => null
isLBracket.type = "LBracket"
isRBracket.type = "RBracket"
isLBrace.type = "LBrace"
isRBrace.type = "RBrace"
isComma.type = "Comma"
isColon.type = "Colon"
isNull.type = "null"
isBoolean.type = "boolean"
isNumber.type = "number"
isString.type = "string"

const c = {
    isLBracket,
    isRBracket,
    isLBrace,
    isRBrace,
    isComma,
    isColon,
    isNull,
    isBoolean,
    isNumber,
    isString,
    toBoolean,
    toNumber,
    toNull
}

module.exports = c
