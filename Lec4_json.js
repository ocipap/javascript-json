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
    end : {"]" : "array", "}" : "object"},
    count : {"[" : 0, "{" : 0, "]" : 0, "}" : 0, ":" : 0}
}

const tokenChecker = {
    isStartToken(token){
        if(Object.keys(tokenMap.start).includes(token)) tokenMap.count[token]++; return tokenMap.start[token];
    }, 
    isEndToken(token, result){
        if(Object.keys(tokenMap.end).includes(token) && result.length > 1) tokenMap.count[token]++; return tokenMap.end[token];
    },
    isOtherToken(token){
        if(token === ":") tokenMap.count[':']++;
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

const errorChecker = {
    isArrayClosed(){
        return tokenMap.count["["] === tokenMap.count["]"];
    },
    isObjectClosed(){
        return tokenMap.count["{"] === tokenMap.count["}"];
    },
    isColonInObject(){
        return tokenMap.count['{'] <= tokenMap.count[":"];
    }
}
function parse(str) {
    const tokens = scan(str);
    let result = [], objectKeyName, tokenType;

    for (let i = 0 ; i < tokens.length; i++){
        let token = tokens[i];
        
        if (i === tokens.length-1) {
            tokenMap.count[token]++;
            if (tokenChecker.isFinalToken(token, result) && errorChecker.isArrayClosed() && errorChecker.isObjectClosed() && errorChecker.isColonInObject()) return result;
            else if (!errorChecker.isObjectClosed()) {console.log(`정상적으로 종료되지 않은 객체가 있습니다.`); return;}
            else if (!errorChecker.isArrayClosed()) {console.log(`정상적으로 종료되지 않은 배열이 있습니다.`); return;}
            else if (!errorChecker.isColonInObject()) {console.log(`':'이 누락된 객체표현이 있습니다.`); return;}
        }
            
        if (tokenType = tokenChecker.isStartToken(token)) parseToken.executeStartToken(result, tokenType);
        
        else if (tokenType = tokenChecker.isOtherToken(token)) {
            if(tokenType === 'objectKey' && objectKeyName === undefined){console.log(`올바른 object key 값이 아닙니다.`); return;} 
            parseToken.executeOtherToken(result, tokenType, token, objectKeyName);
        } 

        else if (tokenType = tokenChecker.isEndToken(token, result)) parseToken.executeEndToken(result, tokenType);

        else if (objectStatus && token !== ':') objectKeyName = token;
        
        else if (!countApostrophe(token)) {console.log(`${token}은 올바른 문자열이 아닙니다.`); return;}
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
var str = "['1a3',[null,false,['11',112,'99'], {a:'str', b: [912,[5656,33]], true]";
// var str = "[{a : 'b'}]";
// console.log(parse(str))
console.log(JSON.stringify(parse(str), null, 2));