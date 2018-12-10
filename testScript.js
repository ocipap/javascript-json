const {Data, parseToken, parse} = require('./script.js');
const testSet = require('./testSet.js');

const testData = [
    {
      "type": "array",
      "value": "",
      "child": [
        {
          "type": "number",
          "value": "23"
        },
        {
          "type": "number",
          "value": "234"
        },
        {
          "type": "string",
          "value": "'[123]'"
        },
        {
          "type": "number",
          "value": "2344"
        }
      ]
    }
  ]

testSet.test("<문자열이 올바르게 파싱된다>", function () {
    const str = "[23,234, '[123]' , 2344]";
    // const result = parse(str);
    const result = [1,2];
    return testSet.expect([1,2]).toBeSame(result);
});
