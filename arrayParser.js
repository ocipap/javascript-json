const util = require('./util')
const it = util.it
const L = util.L

const separator = {
    "arrayOpen": "[",
    "comma": ",",
    "arrayClose": "]"
}

const isSeparator = (s) => util.inArray(s, Object.values(separator))

const literalValidator = () => {
    let validators = []
    validators.push(util.validator("number", it.isNumber))
    validators.push(util.validator("null", it.isNull))
    validators.push(util.validator("boolean", it.isBoolean))
    validators.push(util.validator("string", it.isString))
    return validators
}

const literalChecker = util.checker.apply(null, literalValidator())

const seperatorChecker = s => util.findOne(([k, v]) => v === s, Object.entries(separator))

const typedLiteral = (s) => {
    const type = literalChecker(s)
    const typed = { type, value: s, child: [] }
    return typed
}

const typedSeperator = (s) => {
    const [type, value] = seperatorChecker(s)
    const typed = { type, value, child: [] }
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

const lexer =   util.pipe(
                    L.map(s => s.trim()),
                    laxerChecker,
                    L.map(s => isSeparator(s) ? typedSeperator(s) : typedLiteral(s)),
                    util.takeAll
                )

const parser = laxeredArr => {
    let parsedArr = []
    while(laxeredArr.length) {
        let token = laxeredArr.shift()
        if (util.equals(token.type, "arrayOpen")){
            parsedArr.push({ type: "", child: parser(laxeredArr) })
        }
        else if(util.equals(token.type, "arrayClose")){
            return parsedArr
        }
        else {
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


const str = "[123, 22, 33, 'asas',[123, 123, null, true]]"
const result = arrayParser(str)
console.log(JSON.stringify(result, null, 2))