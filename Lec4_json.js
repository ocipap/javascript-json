let tokens = {
    types: [],
    values: []
}

let result = {
    type: ""
}

class Child {
    constructor(type, value, child) {
        this.type = type;
        this.value = value;
        this.child = child
    }
}

function scan(str) {
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '[' || str[i] === ']') {
            tokens.types.push(str[i])
            continue;
        }
        if (str[i] === ' ') {
            continue;
        }
        tokens.values.push(str[i])
    }
    return tokens;
}

function parse(str) {
    if (tokens.types.length === 2) {
        result.type = 'array';
        result.child = [];
    }

    let leftValues = [...tokens.values]
    let type = "";
    let value = "";

    for (let i = 0; i < tokens.values.length; i++) {
        if (Number(tokens.values[i])) {
            value += tokens.values[i];
            type = "number";
            leftValues.shift();
            if(leftValues.length){
            continue;}
        }
        if (tokens.values[i] === ',' || !leftValues.length) {
            let child1 = new Child(type, value, []);
            result.child.push(child1);
            leftValues.shift();
            type = "";
            value = "";
            continue;
        }
    }
    return result;
}

let str = '[123,22,33]'
console.log(parse(scan(str)))