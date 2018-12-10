const tokenMap = {
    others : {":" : "objectKey", "null" : "null", "true" : "boolean", "false" : "boolean", "'" : "string"},
    start : {"[" : "array", "{" : "object"},
    end : {"]" : "array", "}" : "object"}
}

const tokenChecker = {
    isStartToken(token){
        if(Object.keys(tokenMap.start).includes(token)) return tokenMap.start[token];
    }, 
    isEndToken(token, result){
        if(Object.keys(tokenMap.end).includes(token) && result.length > 1) return tokenMap.end[token];
    },
    isOtherToken(token){
        if(Object.keys(tokenMap.others).includes(token)) return tokenMap.others[token];
        if(token[0] === "'") {
            if(countApostrophe(token)) return tokenMap.others[token[0]];
            console.log(`${token}은 올바른 문자열이 아닙니다.`); return false;
        }
        if(!isNaN(Number(token))) return "number";
    },
    isFinalToken(token, result){
        if(token === ']' && result.length === 1) return true;
    }
}

function countApostrophe(token) {
    let count = 0;
    const correctNumApostrophe = 2;
    for (let letter of token) count = isApostrophe(letter, count)
    if (count === correctNumApostrophe) return true;
    return false;
}

function isApostrophe(letter, count){
    if (letter === "'") count++;
    return count;
}

module.exports.tokenMap = tokenMap;
module.exports.tokenChecker = tokenChecker;
module.exports.countApostrophe = countApostrophe;
