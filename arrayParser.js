const util = require('./util')
const it = util.it
const L = util.L

const separator = {
    "arrayOpen": "[",
    "comma": ",",
    "arrayClose": "]"
}

const checker = {
    notString: s => {
        s = s.substring(1, s.length - 1)
        return util.findOne(v => v === "'", s)
    },
    textError: s => {
        return isNaN(Number(s)) && !s.startsWith("'") && !s.endsWith("'") && !["false", "true", "null"].some(v => v === s)
    }
}

const isSeparator = (s) => util.inArray(s, Object.values(separator))

const literalValidator = _ => {
    let validators = []
    validators.push(util.validator("number", it.isNumber))
    validators.push(util.validator("null", it.isNull))
    validators.push(util.validator("boolean", it.isBoolean))
    validators.push(util.validator("string", it.isString))
    return validators
}

const literalChecker = util.checker.apply(null, literalValidator())

const seperatorChecker = s => util.findOne(([k, v]) => v === s, Object.entries(separator))

const laxerValidator = _ => {
    let validators = []
    validators.push(util.errorValidator({
        name: "not-string",
        message: "는(은) 올바른 문자열이 아닙니다."
    }, checker.notString))
    validators.push(util.errorValidator({
        name: "type-error",
        message: "는(은) 알수 없는 타입입니다."
    }, checker.textError))
    return validators
}

const laxerChecker = util.checker.apply(null, laxerValidator())

const typedLiteral = (s) => {
    const lChecker = laxerChecker(s)
    if (lChecker) {
        throw Error(s + lChecker.error.message)
    }
    const type = literalChecker(s).type
    const typed = {
        type,
        value: s,
        child: []
    }
    return typed
}

const typedSeperator = (s) => {
    const [type, value] = seperatorChecker(s)
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

const lexer = util.pipe(
    L.map(s => s.trim()),
    L.map(s => isSeparator(s) ? typedSeperator(s) : typedLiteral(s)),
    util.takeAll
)

const parser = laxeredArr => {
    let parsedArr = []
    while (laxeredArr.length) {
        let token = laxeredArr.shift()
        if (util.equals(token.type, "arrayOpen")) {
            parsedArr.push({
                type: "",
                child: parser(laxeredArr)
            })
        } else if (util.equals(token.type, "arrayClose")) {
            return parsedArr
        } else {
            parsedArr.push(token)
        }
    }
    return parsedArr
}

const arrayParser = util.pipe(
    tokenizer,
    lexer,
    parser
)


try {
    const str = "[123, 22, 33, 'asas',[123, 123, null, true]]"
    const result = arrayParser(str)
    console.log(JSON.stringify(result, null, 2))
} catch (e) {
    console.log(e.message)
}