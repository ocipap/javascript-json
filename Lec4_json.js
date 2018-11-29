class Data {
    constructor(type, value, child) {
        this.type = type;
        this.value = value;
        this.child = child;
    }
}

function scan(str) {
    let tokens = [];
    let stack = "";
    for (let token of str) {
        if (token === '[' || token === '{') {
            stack === "" ? tokens.push(token) : tokens.push(stack);
            stack = "";
        } else if(token === ','){
            if(stack !== "") {tokens.push(stack)};
            stack = "";
        } else if (token === ']' || token === '}' || token === ':') {
            if(stack !== ""){tokens.push(stack)};
            tokens.push(token);
            stack = "";
        } else if (token === ' ') {
            continue;
        } else {
            stack += token;
        }
    }
    return tokens;
}

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
        if(token[0] === "'") return tokenMap.others[token[0]];
        if(!isNaN(Number(token))) return "number";
    },
    isFinalToken(token, result){
        if(token === ']' && result.length === 1) return true;
    }
}

let objectStatus = false;

const parseToken = {
    executeStartToken(result, tokenType){
        result.push(new Data(tokenType, "", []));
        if(tokenType === 'object') objectStatus = true;
    },
    executeOtherToken(result, tokenType, token, objectKeyName){
        const lastChild = result[result.length - 1].child;
        if(tokenType === 'objectKey') lastChild.push(new Data(tokenType, objectKeyName));
        else lastChild.push(new Data(tokenType, token));
    },
    executeEndToken(result, tokenType){
        const lastData = result.pop();
        const lastChild = result[result.length - 1].child;
        lastChild.push(lastData);
        if(tokenType === 'object') objectStatus = false;
    }
}

function parse(str) {
    const tokens = scan(str);
    let result = [];
    let objectKeyName;
    let tokenType;

    for (let token of tokens){
        if (tokenChecker.isFinalToken(token, result)) return result;
        
        if (tokenType = tokenChecker.isStartToken(token)) parseToken.executeStartToken(result, tokenType);
        
        else if (tokenType = tokenChecker.isOtherToken(token)) parseToken.executeOtherToken(result, tokenType, token, objectKeyName);
        
        else if (tokenType = tokenChecker.isEndToken(token, result)) parseToken.executeEndToken(result, tokenType);

        else if (objectStatus && token !== ':') objectKeyName = token;
        
        else {console.log(`${token}은 올바른 문자열이 아닙니다.`); return;}
    } 
}

function countApostrophe(token) {
    let count = 0;
    for (let letter of token) {
        if (letter === "'") count++;
    }
    if (count === 2) return true;
    return false;
}

//test

var str = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a: 'a' }, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]";
// var str = "[1,{a:'str', b:[912,[5656,33]]}]";
// var str = "[1,{key: [2,{a:'a'}]}]"
// console.log(parse(str))
console.log(JSON.stringify(parse(str), null, 2));