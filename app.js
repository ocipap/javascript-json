const ArrayParser = require('./ArrayParser');
const str = '[123, 22, 33, 123, 45, 6, 78, 6]';

result= ArrayParser(str);
console.log(JSON.stringify(result, null, 2));
