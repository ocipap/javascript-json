function ArrayParser(str) {
    const token = tokenizer(str);
    return parser(token);
}

function tokenizer(input) {
    // current: tracking the position in the code like a cursor
    let current = 0;

    // tokens: array for pushing tokens to
    let tokens = [];

    while (current < input.length){

        let char = input[current];

        // 배열 시작'[' 확인
        if(char === '['){
            tokens.push({
                type: 'arr',
                value: '['
            });
            current ++;
        }

        // 배열 끝 확인
        if (char ===']'){
            tokens.push({
                type: 'arr',
                value: ']'
            });
            current++;
        }

        // 공백을 만나면 skip 한다.
        let WHITESPACE = /\s/;
        if(WHITESPACE.test(char)){
            current++;
            continue;
        }

        // 쉼표를 만나면 skip 한다.
        let COMMA = ',';
        if(char === COMMA){
            current++;
        }

        // 숫자를 만나면 type 을 number 로 주고 tokens 에 push 한다.
        let NUMBERS = /[0-9]/;
        if(NUMBERS.test(char)){

            // 숫자값을 담을 value 변수를 선언.
            let value = '';

            // 숫자를 만나면 value 변수에 할당한다.
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }

            // tokens array 에 'number' token 을 push 한다.
            tokens.push({
                type: 'number',
                value,
                child: [],
            });
        }
    }
    return tokens;
}


// parser 함수는 인자로 token array 를 받는다.
function parser(tokens) {

// AST: root. type 이름은 'Array'
    let ast = {
        type: 'Array',
        child: [],
    };

    tokens.filter(function (e) {
        return e.type === 'number'
    }).map(function (e) {
        return ast.child.push(e)
    });

    return ast;
}

module.exports = ArrayParser;