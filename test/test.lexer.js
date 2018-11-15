const { test } = require('./test');
const { expect } = require('./expect');
const { toBeDataArray, toBeDataObject } = require('./test-data-lexer');
const { Tokenizer } = require('../tokenizer');
const { lexer, Lexeme } = require('../lexer');

test('lexeme 객체의 type을 얻습니다.', function () {
    const result = Lexeme.getType("123");

    expect(result).toBe('number');
})

test('lexeme 객체의 value를 얻습니다.', function () {
    const result = Lexeme.getValue("number", "123");

    expect(result).toBe(123);
})

test('data type: true, lexer를 수행합니다.', function () {
    const str = "true";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens)[0];

    expect(lexemes).toBe({ type: 'boolean', value: true });
})

test('data type: false, lexer를 수행합니다.', function () {
    const str = "false";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens)[0];

    expect(lexemes).toBe({ type: 'boolean', value: false });
})

test('data type: string, lexer를 수행합니다.', function () {
    const str = "'this is never that'";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens)[0];

    expect(lexemes).toBe({ type: 'string', value: 'this is never that' });
})

test('data type: number, lexer를 수행합니다.', function () {
    const str = "123456";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens)[0];

    expect(lexemes).toBe({ type: 'number', value: 123456 });
})

test('data type: array, lexer를 수행합니다.', function () {
    const str = "[1,2,3]";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens);

    expect(lexemes).toBe(toBeDataArray);
})

test('data type: object, lexer를 수행합니다.', function () {
    const str = "{a: 'crong', b: [1]}";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);
    const lexemes = lexer(tokens);

    expect(lexemes).toBe(toBeDataObject);
})

test("type을 확인할 수 없을 시, 에러 메세지를 호출합니다.", function () {
    const str = "['torco', 3d3]";
    const tokenizer = new Tokenizer;
    const tokens = tokenizer.run(str);

    try {
        lexer(tokens);
    }
    catch (err) {
        expect(err).toBe(`3d3은 올바른 타입이 아닙니다.`);
    }
})