const { test } = require('./test');
const { expect } = require('./expect');
const { toBeData } = require('./test-data-parser');
const { arrayParser } = require('../arrayparser');

test('문자열을 올바르게 파싱합니다.', function () {
    const str = "[1, true, 'code', [2,3], {a: null}]";
    const parsedData = arrayParser(str);

    expect(parsedData).toBe(toBeData);
})