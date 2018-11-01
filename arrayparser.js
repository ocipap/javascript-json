const Stack = require("./stack.js");
const Tokenizer = require("./tokenizer.js");
const lexer = require("./lexer.js");

class Data {
  constructor(type, value, child) {
    this.type = type;
    this.value = value;
    if (child) this.child = child;
  }
}

function arrayParser(str) {
  const stack = new Stack();
  const tokenizer = new Tokenizer;
  const tokens = tokenizer.run(str);
  const lexemes = lexer(tokens);

  let parsedData;


  for (let lexeme of lexemes) {
    const type = lexeme.type;
    const value = lexeme.value;

    if (type === 'array' || type === 'object') {
      stack.push(new Data(type, value, []));
    }
    else if (type === 'arrayClose' || type === 'objectClose') {
      parsedData = stack.pop();

      stack.top ? stack.peek().child.push(parsedData) : '';
    }
    else {
      const top = stack.peek();
      top.child.push(new Data(type, value));
      tempData = '';
    }
  }
  return parsedData;
};

/*
Test Case
*/
// const str = "['1a3',[null,false,['11',112,'99', {a : 'str', b : [912,[5656,33]]}], true]]";;
// const result = arrayParser(str);
// console.log(JSON.stringify(result, null, 2));

// const s1 = "['1a3',[null,false,['11',112,'99' , {a:'str', b:[912,[5656,33]]}, true]";
// const result1 = arrayParser(s1);
// console.log(JSON.stringify(result1, null, 2));
// // 정상적으로 종료되지 않은 배열이 있습니다.

// const s2 = "['1a3',[null,false,['11',112,'99'], {a:'str', b: [912,[5656,33]], true]";
// const result2 = arrayParser(s2);
// console.log(JSON.stringify(result2, null, 2));
// // 정상적으로 종료되지 않은 객체가 있습니다.

// const s3 = "['1a3',[null,false,['11',112,'99'], {a:'str', b  [912,[5656,33]]}, true]";
// const result3 = arrayParser(s3);
// console.log(JSON.stringify(result3, null, 2));
// // ':'이 누락된 객체표현이 있습니다.

// const s4 = "['1a3',[null,false,['11',112,'99'], {a:'str', b : }, true]";
// const result4 = arrayParser(s4);
// console.log(JSON.stringify(result4, null, 2));
// // key의 value가 정의되지 않았습니다.

// const s5 = "['1a3',[null,false,['11',112,'99'], , {a:'str', b  [912,[5656,33]]}, true]";
// const result5 = arrayParser(s5);
// console.log(JSON.stringify(result5, null, 2));
// // 연속된 ','가 존재합니다.

// const s6 = "['1a3',[null,false,['11',112,'99'], {a:'str', : [912,[5656,33]]}, true]";
// const result6 = arrayParser(s6);
// console.log(JSON.stringify(result6, null, 2));
// // 연속된 ','가 존재합니다.