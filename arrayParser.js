const util = require('./util')

const separator = ["[", ",", "]"]

const isSeparator = (s) => util.inArray(s, separator)

const tokenizer = (text) => {
    let data = ""
    const tokenizedArr = []
    for (const s of text) {
        if (isSeparator(s)) {
            if(s === ",") {
                tokenizedArr.push(data)
            }
            else {
                (data !== "") ? tokenizedArr.push(data, s) : tokenizedArr.push(s)
            }
            data = ""
        } else {
            if(s.trim() !== "" || data !== "") data += s
        }
    }
    return tokenizedArr
}

const lexer = () => {
    
}

const parser = () => {

}

const arrayParser = (jsonString) => {
    console.log(
        util.go(
            jsonString,
            tokenizer,
        )
    )
}

arrayParser("[123, 23, ssddd, aas]")