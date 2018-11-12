class Stack {
  constructor() {
    this.list = [];
    this.endCount = -1;
  }
};
function arrayParser(str) {
  let tokenArray = lexer(tokenize, str);
  let result = tokenArray.reduce(reducer, tokenArray[0]);
  return result;
};
function lexer(fn, str) {
  let tokenArray = fn(str);
  let lexerResult = tokenArray.map(v => {
    if (v === '[') return { type: 'array', value: 'ArrayObject', child: [] };
    if (Number(v)) return { type: 'number', value: `${v}`, child: [] };
    return v;
  });
  return lexerResult;
};
function tokenize(str) {
  let result = each(str, checkToken);
  return result;
};
function each(str, iter) {
  let result = [];
  let number;
  for (i = 0; i < str.length; i++) {
    number = iter(str, result, number);
  }
  return result;
};
function checkToken(str, result, number) {
  if (number === undefined) number = '';
  if (str[i] === ']' && str[i - 1] !== ']') result.push(number);
  if (str[i].match(/\[|\]/)) result.push(`${str[i]}`);
  if (str[i].match(/[^\[\],]/)) number += str[i];
  if (str[i] === ',') {
    if (str[i - 1] === ']') {
      number = '';
    } else {
      result.push(number);
      number = '';
    }
  };
  return number;
};
function reducer(acc, cur) {
  arg = [acc, cur];
  return checkNum(...arg) || checkArray(...arg) || checkEnd(...arg) || acc;
};
function checkNum(acc, cur) {
  if (cur.type === 'number') return pushChild(...arguments);
  return false;
};
function pushChild(acc, cur) {
  acc.child.push(cur);
  return acc;
};
function checkArray(acc, cur) {
  if (cur.type === 'array') {
    stack.list.push(acc);
    stack.endCount++;
    acc = cur;
    return acc;
  }
  return false;
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

let str = "[1,[1,[1,[1,3,[1,[2,[11233,[4,[5,[6,[7],1],3],4]]]],6]]], 22]";
let stack = new Stack;
let result = arrayParser(str);
console.log(JSON.stringify(result, null, 2));
