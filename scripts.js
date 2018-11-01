function lexer(str) {
  let result = []
  let number = ''
  for (i = 0; i < str.length; i++) {
    if (str[i].match(/\]/)) result.push(number);
    if (str[i].match(/\[|\]/)) result.push(`${str[i]}`);
    if (str[i].match(/[^\[\],]/)) number += str[i];
    if (str[i].match(/,/)) {
      result.push(number);
      number = '';
    };
  };
  return result;
};
function arrayParser(str) {
  let lexerResult = lexer(str);
  let parserResult = {};
  if (lexerResult[0] + lexerResult[lexerResult.length - 1] === '[]') parserResult.type = 'array'
  parserResult.child = [];
  for (i = 1; i < lexerResult.length - 1; i++) {
    if (Number(lexerResult[i])) parserResult.child[i - 1] = { type: 'number', value: `${lexerResult[i]}`, child: [] }
  }
  return parserResult;
};
let result = arrayParser('[11,332,132]');
console.log(JSON.stringify(result, null, 2));
