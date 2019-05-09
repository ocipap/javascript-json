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
    return validators
}

const typedLiteral = (s) => {
    const literalChecker = util.checker.apply(null, literalValidator())
    const type = literalChecker(s)
    if (!type) throw Error("지원하지 않는 타입")
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
    const parsedObj = {
        type: "",
        child: []
    }
    const rootNode = laxeredArr.shift()
    if (rootNode.type == "arrayOpen") {
        parsedObj.type = "array"
    }
    laxeredArr.forEach(el => {
        if (util.equals(el.type, "arrayOpen")){
            // 6-2를 위한 코드
        }
        else if(util.equals(el.type, "arrayClose")){
            // 6-2를 위한 코드
        }
        else {
            parsedObj.child.push(el)
        }
        
    });
    return parsedObj
}

const arrayParser = (jsonString) => {
    try {
        return util.go(
            jsonString,
            tokenizer,
            lexer,
            parser
        )
    } catch (e) {
        console.log(e.message)
    }
}

const str = "[123, 22, 33]"
const result = arrayParser(str)
console.log(JSON.stringify(result, null, 2))