class Stack {
  constructor() {
    this.list = [];
    this.endCount = -1;
  }
};
function tokenReducer(acc, cur) {
  arg = [acc, cur];
  return checkNumOrStr(...arg) || checkArray(...arg) || checkEnd(...arg) || acc;
};
function checkNumOrStr(acc, cur) {
  if (cur.type !== 'array' && cur !== ']') {
    acc.child.push(cur);
    return acc;
  }
  return false;
};
function checkArray(acc, cur) {
  if (cur.type !== 'array') return false;
  stack.list.push(acc);
  stack.endCount++;
  acc = cur;
  return acc;

};
function checkEnd(acc, cur) {
  if (cur === ']' && stack.endCount !== 0) {
    stack.list[stack.endCount].child.push(acc);
    acc = stack.list[stack.endCount];
    stack.endCount--;
    return acc;
  }
  return false;
};
function arrayParser(str) {
  let tokenArray = lexer(tokenize, str);
  console.log('입력하신 str에 대한 분석결과는...')
  if (tokenArray) return tokenArray.reduce(tokenReducer, tokenArray[0]);
  return [];
};
function lexer(fn, str) {
  let tokenArray = fn(str);
  if (checkSyntax(tokenArray)) return false;
  let lexerResult = tokenArray.map(tokenMapper);
  return lexerResult;
};
function checkSyntax(tokenArray) {
  var result = tokenArray.some(v => {
    if (checkQuote(v)) return true;
    if (checkNaN(v)) return true;
  })
  return result ? true : false;
}
function checkQuote(val) {
  if (val.match(/'|"/g) !== null && val.match(/'|"/g).length % 2 !== 0) {
    console.error(`${val} 는 올바른 값이 아닙니다`)
    return true;
  }
  return false;
}
function checkNaN(val) {
  if (getBoolean(val)) return false;
  if (val.match(/'|"/g) === null && val !== '[' && val !== ']' && isNaN(val * 1)) {
    console.log(`${val}는 알수없는 타입임니다.`)
    return true;
  }
  if (typeof val === 'string' && val !== ']') return false;
}
function getBoolean(val) {
  val = val.match(/\S\w*/g)
  return type['bool'].some(function (bool) {
    return bool === val[0];
  });
}
const type = {
  '[': { type: 'array', value: 'ArrayObject', child: [] },
  'null': { type: 'Null', value: `null`, child: [] },
  'true': { type: 'Boolean', value: `true`, child: [] },
  'false': { type: 'Boolean', value: `false`, child: [] },
  'bool': ['true', 'false', 'null']
};
function tokenMapper(value) {
  let conversionValue = value.match(/[^\s]\w*'|[^\s]\w*/)[0];
  if (checktype(conversionValue)) return deepCopyObj(checktype(conversionValue));
  if (Number(conversionValue)) return { type: 'number', value: `${conversionValue}`, child: [] };
  if (typeof conversionValue === 'string' && conversionValue !== ']') {
    return { type: 'string', value: `${conversionValue}`, child: [] };
  }
  return conversionValue;
};
function deepCopyObj(obj) {
  let copiedObj = JSON.parse(JSON.stringify(obj))
  return copiedObj;
};
function checktype(value) {
  if (type[value]) return type[value];
  return false;
};
function tokenize(str) {
  let result = each(str, checkToken);
  return result;
};
function each(str, iter) {
  let result = [];
  let token;
  for (let i = 0; i < str.length; i++) {
    token = iter(str, result, token, i);
  }
  return result;
};
function checkToken(str, result, token, i) {
  if (token === undefined) token = '';
  if (str[i] === ']' && str[i - 1] !== ']') result.push(token);
  if (str[i] === ']' || str[i] === '[') result.push(`${str[i]}`);
  if (str[i].match(/[^\[\],]/)) token += str[i];
  if (str[i] === ',' && str[i - 1] === ']') token = '';
  if (str[i] === ',' && str[i - 1] !== ']') { result.push(token); token = ''; }
  return token;
};

let str = "['3a3',[null, false, ['11', [['null',[false]]], 'a112'],55,'99'],33,true]";
// let str = '[1,2,[3,[4,[5],1],2],3]';
let stack = new Stack;
let result = arrayParser(str);
console.log(JSON.stringify(result, null, 2));
