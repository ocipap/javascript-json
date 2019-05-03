const util = require('./util')
const it = util.it

const separator = {
    "arrayOpen" : "[",
    "comma" : ",",
    "arrayClose" : "]"
}

const isSeparator = (s) => util.inArray(s, Object.values(separator))

const literalValidator = () => {
    let validators = []
    validators.push(util.validator("number", it.isNumber))
    return validators
}

const typedLiteral = (s) => {
    const literalChecker = util.checker.apply(null, literalValidator())
    const type = literalChecker(s)
    if(!type) throw "지원하지 않는 타입"
    const typed = {
        type,
        value: s,
        child: [],
    }
    return typed
}

const typedSeperator = (s) => {
    const [type, value] = util.findOne(([k, v]) => v === s, Object.entries(separator))
    const typed = {
        type,
        value,
        child: []
    }
    return typed
}

const tokenizer = (text) => {
    let data = ""
    const tokenizedArr = []
    for (const s of text) {
        if (s === ",") {
            tokenizedArr.push(data)
            data = ""
        } else if (isSeparator(s)) {
            (data !== "") ? tokenizedArr.push(data, s): tokenizedArr.push(s)
            data = ""
        } else {
            if (s.trim() !== "" || data !== "") data += s
        }
    }
    return tokenizedArr
}

const lexer = (tokenizedArr) => {
    return util.go(
        tokenizedArr,
        util.map(s => s.trim()),
        util.map(s => isSeparator(s) ? typedSeperator(s) : typedLiteral(s))
    )
}

const parser = (laxeredArr) => {
    
}

const arrayParser = (jsonString) => {
    console.log(
        util.go(
            jsonString,
            tokenizer,
            lexer,
        )
    )
}

arrayParser("[123, 13, 10]")