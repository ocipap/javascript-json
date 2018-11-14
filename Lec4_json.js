function scan(str) {
    let tokens = [];
    for (let i = 0; i < str.length; i++) {
        tokens.push(str[i])
    }
    return tokens;
}

function checkType(tokens) {
    if (tokens[0] === '[' && tokens[tokens.length - 1] === ']') {
        return 'array';
    }
    if (Number(tokens)) {
        return 'number';
    }
}

function divideTokens(str) {
    const tokens = scan(str);
    let values = [];
    let emptyArr = [];
    for (let i = 0; i < tokens.length; i++) {
        if (i === tokens.length - 1) {
            emptyArr.push(tokens[i]);
            values.push(emptyArr.join(''));
            break;
        }
        if (tokens[i] !== ',') {
            emptyArr.push(tokens[i]);
            continue;
        }
        values.push(emptyArr.join(''));
        emptyArr = [];
    }

    return values;
}

function removeBrackets(str) {
    let stringToArr = str.split('');
    stringToArr.pop();
    stringToArr.shift();
    return stringToArr.join('');
}


function parse(str) {
    let result = {}
    result.type = checkType(str);
    if (result.type === 'array') {
        str = removeBrackets(str);
        result.child = divideTokens(str);
    }
    if (result.type === 'number') {
        result.value = divideTokens(str).join('');
        result.child = [];
    }
    return result;
}

function getResult(str) {
    let result = parse(str);
    if (result.child !== []) {
        for (let i = 0; i < result.child.length; i++) {
            result.child[i] = parse(result.child[i]);
        }
    }
    for (let i = 0; i < result.child.length; i++) {
        if (result.child[i].type === 'array') {
            result.child[i].child = parse(result.child[i].child)
        }
    }
    return result;
}

//test
const str = '[123,[22],33]'
console.log(getResult(str))