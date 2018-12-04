const testHelper = require('./test_helper.js');
const Parser = require('./scripts.js');
const parser = new Parser();

const expect = testHelper.expect;
const test = testHelper.test;

test('문자열의 닫힌 특수문자까지의 문자열을 반환한다', function(){
  const data = '[dsacd"sa,cds]';
  const target = 2;
  const result = parser.getOtherValue(data, target);
  return expect('sacd').toBe(result);
})
test('현재 인덱스로 부터 가장 근접한 특수문자까지의 문자열을 반환한다', function(){
  const data = '[dsacdsa,cds]';
  const target = 2;
  const result = parser.getOtherValue(data, target);
  return expect('sacdsa').toBe(result);
})
test('닫힌 특수문자를 발견했을때 현재, 부모의 타겟이 바뀐다',function(){
  const input = ']', 
        parent = {type: 'array', child: []}, 
        curr = parent.child;
        curr.push({type: 'array', child: [], parent: parent});
  const child = curr.child;
  const resultArr = parser.setBracketValue({child, curr, input});
  const test = [parent.child, parent.parent];
  const result = resultArr.every((v,i) => test[i] === v);
  return expect(true).toBe(result);
});
test('열린 특수문자를 발견했을때 새 배열을 추가하며 현재, 부모의 타겟이 바뀐다',function(){
  const input = '[', parent = {type: 'array', child: []}, curr = parent.child;
  const resultArr = parser.setBracketValue({curr, parent, input});
  const test = [curr.slice(-1)[0].child, curr.slice(-1)[0]];
  const result = resultArr.every((v,i) => test[i] === v);
  return expect(true).toBe(result);
});
test('문자열의 개폐 여부를 파악하며 값을 토글한다',function(){
  const status = {strStatus: 'open'};
  const result = parser.setStrValue(status);
  return expect('close').toBe(result);
});
test('오브젝트 내부의 값에 따른 상태값을 나타낸다',function(){
  const parent = {type: 'object'};
  const curr = [{status: 'object_key'}];
  const result = parser.checkObjStatus(parent, curr);
  return expect('object_value').toBe(result);
});
test('공백이 없는 순수한 값이 나온다', function(){
  const str = ' abe ';
  const result = parser.trimData(str);
  return expect('abe').toBe(result);
});