const Scan = require('./scan.js');
const {tokenChecker, tokenMap, countApostrophe} = require('./tokenChecker.js');

class Data {
    constructor(type, value, child) {
        this.type = type;
        this.value = value;
        this.child = child;
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
    const tokens = scan.tokenize(str);
    let result = [];
    let objectKeyName;
    let tokenType;

    for (let token of tokens){
        if (tokenChecker.isFinalToken(token, result)) return result;
        
        if (tokenType = tokenChecker.isStartToken(token)) parseToken.executeStartToken(result, tokenType);
        
        else if (tokenType = tokenChecker.isOtherToken(token)) parseToken.executeOtherToken(result, tokenType, token, objectKeyName);
        
        else if (tokenType = tokenChecker.isEndToken(token, result)) parseToken.executeEndToken(result, tokenType);

        else if (objectStatus && token !== ':') objectKeyName = token;
    } 
}

//test

// var str = "['1a3',[null,false,['11',112,'99'], {a:'str', b: [912,[5656,33]], true}]]";
var str = "[1,{a:'str', b:[912,[5656,33]]}]";
// const str = "['1,{key: [2,{a:'a'}]}']"
// const str = "[23,234, '[123]' , 2344]";
const scan = new Scan();

// console.log(scan(str))
console.log(JSON.stringify(parse(str), null, 2));


module.exports.Data = Data;
module.exports.parseToken = parseToken;
module.exports.parse = parse;
module.exports.objectStatus = objectStatus;
