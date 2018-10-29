const Stack = require("./stack.js");
const Tokenizer = require("./tokenizer.js");
const lexer = require("./lexer.js");

class Data {
  constructor(type, value, child = []) {
    this.type = type;
    this.value = value;
    this.child = child;
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
      stack.push(new Data(type, value));
    }
    else if (type === 'arrayClose' || type === 'objectClose') {
      parsedData = stack.pop();

      stack.top ? stack.peek().child.push(parsedData) : '';
    }
    else {
      const top = stack.peek();
      top.child.push(new Data(type, value, ''));
      tempData = '';
    }
  }
  return parsedData;
};

/*
Test Case
*/
const str = "['1a3',[null,false,['11',[112233],{easy : ['hello', {a:'a'}, 'world']},112],55, '99'],{a:'str', b:[912,[5656,33],{key : 'innervalue', newkeys: [1,2,3,4,5]}]}, true]"
const result = arrayParser(str);
console.log(JSON.stringify(result, null, 2));
