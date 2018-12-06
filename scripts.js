class Stack {
  constructor() {
    this.list = [];
    this.endCount = -1;
    this.objCount = 0;
  }
};
class Type {
  constructor() {
    this.result = {
      '[': { type: 'array', value: 'ArrayObject', child: [] },
      'null': { type: 'Null', value: `null`, child: [] },
      'true': { type: 'Boolean', value: `true`, child: [] },
      'false': { type: 'Boolean', value: `false`, child: [] },
      'bool': ['true', 'false', 'null'],
    }
  }
};
class ArrParser {
  constructor() {
    this.stack = new Stack;
    this.type = new Type;
  };
  tokenReducer(acc, cur) {
    let arg = [acc, cur];
    return this.checkNumOrStr(...arg) || this.checkArray(...arg) || this.checkEnd(...arg) || acc;
  };
  checkNumOrStr(acc, cur) {
    if (cur.type !== 'array' && cur !== ']') {
      acc.child.push(cur);
      return acc;
    }
    return false;
  };
  checkArray(acc, cur) {
    if (cur.type !== 'array') return false;
    this.stack.list.push(acc);
    this.stack.endCount++;
    acc = cur;
    return acc;
  };
  checkEnd(acc, cur) {
    if (cur === ']' && this.stack.endCount !== 0) {
      this.stack.list[this.stack.endCount].child.push(acc);
      acc = this.stack.list[this.stack.endCount];
      this.stack.endCount--;
      return acc;
    }
    return false;
  };
  parser(str) {
    this.checkBracket(str);
    let tokenArray = this.lexer(this.tokenize.bind(this), str);
    if (tokenArray) {
      this.initializeStack();
      return tokenArray.reduce(this.tokenReducer.bind(this), tokenArray[0]);
    }
    return [];
  };
  checkBracket(str) {
    let wrongArrBracket = str.match(/\[|\]/g);
    if (wrongArrBracket.length % 2) throw new Error('제대로 종료되지 않은 배열이 있습니다!(대괄호의 갯수가 맞지 않아요)');
    let wrongObjBracket = str.match(/\{|\}/g);
    if (wrongArrBracket.length % 2 && wrongObjBracket.length % 2) throw new Error('제대로 종료되지 않은 객체가 있습니다!(중괄호의 갯수가 맞지 않아요)');
    return false;
  }
  initializeStack() {
    this.stack = new Stack;
  };
  lexer(fn, str) {
    let tokenArray = fn(str);
    if (this.checkSyntax(tokenArray)) return false;
    let lexerResult = tokenArray.map(this.tokenMapper.bind(this));
    return lexerResult;
  };
  checkSyntax(tokenArray) {
    var result = tokenArray.some(v => {
      if (this.checkQuote(v)) return true;
      if (this.checkNaN(v)) return true;
    })
    return !!result;
  };
  checkQuote(val) {
    if (val.match(/'|"/g) !== null && val.match(/'|"/g).length % 2 !== 0) {
      throw new Error(`${val} 는 올바른 값이 아닙니다`);
    }
    return false;
  };
  checkNaN(val) {
    if (this.getBoolean(val)) return false;
    if (val.match(/'|"|\{/g) === null && val !== '[' && val !== ']' && isNaN(val * 1)) {
      throw new Error(`${val}는 알수없는 타입 입니다.`);
    }
    if (typeof val === 'string' && val !== ']') return false;
  };
  getBoolean(val) {
    val = val.match(/\S\w*/g);
    return this.type.result['bool'].some(bool => bool === val[0]);
  };
  tokenMapper(value) {
    if (value.match(/{/g)) return this.checkType(value, 'obj');
    let conversionValue = value.match(/[^\s]\w*('|")|[^\s]\w*/)[0];
    if (this.checkType(conversionValue)) return this.deepCopyObj(this.checkType(conversionValue));
    if (Number(conversionValue)) return { type: 'number', value: `${conversionValue}`, child: [] };
    if (typeof conversionValue === 'string' && conversionValue !== ']') {
      return { type: 'string', value: `${conversionValue}`, child: [] };
    }
    return conversionValue;
  };
  deepCopyObj(obj) {
    let copiedObj = JSON.parse(JSON.stringify(obj));
    return copiedObj;
  };
  checkType(value, obj = 0) {
    if (obj) return this.returnObj(value);
    if (this.type.result[value]) return this.type.result[value];
    return false;
  };
  returnObj(value) {
    let result = { type: 'object', value: null };
    result.value = this.createObj(value);
    return result;
  };
  createObj(value) {
    let [result, key, val, keyCount, arrayCount] = [{}, '', '', 0, 0];
    for (let indx in value) {
      let token = value[indx];
      if (token === '{' && arrayCount === 0) continue;
      if (token === ' ') continue;
      if (token === '[') arrayCount++;
      if (token === '}' && arrayCount === 0 || token === ',' && arrayCount === 0) {
        this.checkKeyType(key);
        result[key] = this.inObjTokenMapper(val);
        [key, val, keyCount] = ['', '', 0];
      }
      if (arrayCount !== 0) val += token;
      if (keyCount === 0 && token !== ':' && token !== ',') key += token;
      if (keyCount !== 0 && token !== '}' && arrayCount === 0) val += token;
      if (token === ']' && arrayCount !== 0) arrayCount--;
      if (token === ':') keyCount++;
    }
    return result;
  }
  checkKeyType(key) {
    if (key.match(/\[|\{|\]|\}/g)) throw new Error('key 값에 허용되지 않는 값이 있습니다.');
    return true;
  };
  tokenize(str) {
    let result = this.each(str, this.checkToken.bind(this));
    return result;
  };
  each(str, iter) {
    let result = [];
    let token;
    for (let i = 0; i < str.length; i++) {
      token = iter(str, result, token, i);
    }
    return result;
  };
  checkObjToken(str, token, i) {
    if (str[i] === '{' || this.stack.objCount !== 0) {
      if (str[i] === '{') this.stack.objCount++;
      token += str[i];
      if (str[i] === '}') this.stack.objCount--;
      return token;
    }
    return false;
  };
  checkToken(str, result, token, i) {
    if (token === undefined) token = '';
    if (this.checkObjToken(str, token, i)) return this.checkObjToken(str, token, i);
    if (str[i] === ']' && str[i - 1] !== ']') result.push(token);
    if (str[i] === ']' || str[i] === '[') result.push(`${str[i]}`);
    if (str[i].match(/[^\[\],]/)) token += str[i];
    if (str[i] === ',' && str[i - 1] === ']') token = '';
    if (str[i] === ',' && str[i - 1] !== ']' && this.stack.objCount === 0) { result.push(token); token = ''; }
    return token;
  };
  inObjTokenMapper(val) {
    this.checkInObjValue(val);
    if (this.checkString(val)) return { type: 'string', value: `${val}` };
    if (!isNaN(val)) return { type: 'number', value: `${val}` };
    if (this.checkBool(val)) return this.type.result[val];
    if (val.match(/^\[/g)) return this.parser(val);
    if (val.match(/\{/g)) return this.createObj(val);
  };
  checkInObjValue(val) {
    this.checkQuote(val);
    this.checkNaN(val);
  };
  checkString(val) {
    const bool = ['null', 'false', 'ture'];
    if (isNaN(val) && val.match(/\{|\[/g) === null && !bool.includes(val)) return true;
    return false;
  };
  checkBool(val) {
    const bool = ['true', 'flase', 'null'];
    return bool.includes(val);
  };
};

module.exports = { ArrParser, Type, Stack };

let str = '[1,2,3]';
let _array = new ArrParser();
let result = _array.parser(str);
// console.log(JSON.stringify(result, null, 2));