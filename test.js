// test 함수구현
const equal = (a, b) => {
	if (typeof b === 'object') return objEqual(a, b);
	if (a === b) return true;
	return false;
};
const objEqual = (ob1j, obj2) => {
	if (JSON.stringify(ob1j) === JSON.stringify(obj2)) return true;
	return false;
};
const test = function (text, fn) {
	let result = fn();
	console.log(`${text} : ${result}`);
};
const expect = function (expectValue) {
	let result = {};
	result.expectValue = expectValue;
	result.toBe = function (val) {
		if (equal(expectValue, val)) return true;
		return `${false} (결과값 : ${val} , 기대값 : ${expectValue})`;
	}
	return result;
};
const exportScr = require("./scripts.js");
const ArrParser = new exportScr.ArrParser;

// ArrParser class 의 createObj test
test("creatObj함수의 결과값이 기대한 객체로 반환된다", function () {
	const givenobj = '{a : 1, b : 2}';
	const expectObj = {
		"a": {
			"type": "number",
			"value": '1'
		},
		"b": {
			"type": "number",
			"value": '2'
		}
	};
	const result = ArrParser.createObj(givenobj);
	return expect(expectObj).toBe(result);
});
// ArrParser class 의 tokenize test
test('tokenize함수의 결과값이 기대한 토큰 단위의 배열로 반환된다', function () {
	const givenStr = '[1,2,3]';
	const expectArr = ['[', '1', '2', '3', ']'];
	const result = ArrParser.tokenize(givenStr);
	return expect(expectArr).toBe(result);
});
// ArrParser class 의 lexer test
test('lexer함수의 결과값이 기대한 값으로 맵핑되어 배열로 반환된다', function () {
	const givenStr = '[1,2,3]'
	const expectArr = [
		{ type: 'array', value: 'ArrayObject', child: [] },
		{ type: 'number', value: '1', child: [] },
		{ type: 'number', value: '2', child: [] },
		{ type: 'number', value: '3', child: [] },
		']'
	];
	const result = ArrParser.lexer(ArrParser.tokenize.bind(ArrParser), givenStr);
	return expect(expectArr).toBe(result);
});
// ArrParser class 의 getBoolean test
test('getBoolean함수에 string타입의 bool값을 주면 true로 반환된다', function () {
	const givenStr = 'false';
	const expectValue = true;
	const result = ArrParser.getBoolean(givenStr);
	return expect(expectValue).toBe(result);
});
// ArrParser 최종 결과값 test
test('parser함수의 결과값이 토큰을분석한 객체로 반환된다', function(){
	const givenStr = '[1,2,3]';
	const expectValue = {
		"type": "array",
		"value": "ArrayObject",
		"child": [
			{
				"type": "number",
				"value": "1",
				"child": []
			},
			{
				"type": "number",
				"value": "2",
				"child": []
			},
			{
				"type": "number",
				"value": "3",
				"child": []
			}
		]
	};
	const result = ArrParser.parser(givenStr);
	return expect(expectValue).toBe(result);
});
test('checkKeyType함수에 배열이나 객체값이 들어가면 오류를 반환한다', function(){
	const givenStr = '1,2';
	const expectValue = true;
	try {
		return ArrParser.checkKeyType(givenStr);
	} catch (error) {
		return expect(expectValue).toBe(false);
	};
});
test('checkQuote함수에 따옴표 갯수가 맞지 않은 값이 들어가면 오류를 반환한다', function(){
	const givenStr = '1"2'
	const expectValue = false;
	try {
		return ArrParser.checkQuote(givenStr);
	} catch (error) {
		return expect(expectValue).toBe(false);
	}
});
test('checkNaN함수에 1a3같은 정의되지않은 값이 들어가면 오류를 반환한다', function(){
	const givenStr = '1a3';
	const expectValue = false;
	try {
		return ArrParser.checkNaN(givenStr);
	} catch (error) {
		return expect(expectValue).toBe(false);
	}
});
test('checkBracket함수에 괄호가 짝수가아닌 string이 들어가면 오류를 반환한다.', function(){
	const givenStr = '[1,2,3]]';
	const expectValue = false;
	try {
		return ArrParser.checkBracket(givenStr);
	} catch (error) {
		return expect(expectValue).toBe(false);
	}
});