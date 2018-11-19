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
        if (token === ',' || token === '[') {
            stack === "" ? tokens.push(token) : tokens.push(stack);
            stack = "";
            continue;
        }
        if (token === ']') {
            tokens.push(stack);
            stack = token;
            continue;
        }
        stack += token;
    }
    return tokens;
}

function parse(str) {
    const tokens = scan(str);
    let result = [];
    let type = "", value = "", child = [];

    for (let token of tokens) {
        if (token === '[') {
            type = 'array';
            result.push(new Data(type, value, child));
        } else if (Number(token)) {
            const lastChild = result[result.length - 1].child;
            type = 'number', value = token;
            lastChild.push(new Data(type, value));
            type = "", value = "", child = [];
        } else if (token === ']' && result.length > 1) {
            const lastData = result.pop();
            const lastChild = result[result.length - 1].child;
            lastChild.push(lastData);
        }
    }
    return result;
}

//test
var str = "[123,[22,23,[11,[112233],112],55],33]";
console.log(JSON.stringify(parse(str), null, 2));