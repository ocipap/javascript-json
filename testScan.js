const Scan = require('./scan.js');
const testSet = require('./testSet.js');


testSet.test("<(')로 감싸진 문자열내에 대괄호([,])가 들어오면 배열로 인식하지 않는다.>", function () {
    const scan = new Scan();
    const str = "['[12[3]']";
    const result = scan.tokenize(str)[1]
    return testSet.expect("'[12[3]'").toBe(result);
});

testSet.test("<(')로 감싸진 문자열내에 콤마(,)가 들어오면 dividing point로 인식하지 않는다.>", function () {
    const scan = new Scan();
    const str = "['1,2']";
    const result = scan.tokenize(str)[1];
    return testSet.expect("'1,2'").toBe(result);
});