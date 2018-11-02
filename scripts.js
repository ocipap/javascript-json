function lexer(str) {
  let result = [];
  let number = '';
  for (i = 0; i < str.length; i++) {
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
  };
  return result;
};
function arrayParser(str) {
  let lexerResult = lexer(str);
  let parserResult = {};
  if (lexerResult[0] + lexerResult[lexerResult.length - 1] === '[]') parserResult.type = 'array';
  parserResult.child = [];
  for (let i = 1, j = 1; i < lexerResult.length - 1; i++ , j++) {
    if (Number(lexerResult[i])) {
      parserResult.child[j - 1] = { type: 'number', value: `${lexerResult[i]}`, child: [] };
    }
    if (lexerResult[i] !== '[') continue;
    parserResult.child[j - 1] = { type: 'array', value: 'ArrayObject', child: [] };
    for (let k = i + 1; k < lexerResult.length; k++) {
      if (lexerResult[k] === ']') {
        i = k;
        break;
      };
      parserResult.child[j - 1].child.push({ type: 'number', value: lexerResult[k], child: [] });
    };
  };
  return parserResult;
};
let result = arrayParser('[11,332,[1],[1,2,3],132,[1,2,3],[3],[4]]');

console.log(JSON.stringify(result, null, 2));
