const testHelper = require('./test_helper.js');
const DataType = require('./dataType.js');
const dataType = new DataType();

const expect = testHelper.expect;
const test = testHelper.test;

test('문자열을 체크한다.', function(){
    const value = '"asd"';
    const result = dataType.isString(value);
    return expect(true).toBe(result);
})
test('boolean값을 확인한다', function(){
    const value = 'true';
    const result = dataType.isBoolean(value);
    return expect(true).toBe(result);
})
test('null값을 확인한다', function(){
    const value = 'null';
    const result = dataType.isNull(value);
    return expect(true).toBe(result);
})
test('숫자값을 확인한다', function(){
    const value = '123';
    const result = dataType.isNumber(value);
    return expect(true).toBe(result);
})

