## **[숨] lecture4. Array Parser / step3. 무한 중첩된 배열구조**

### <프로그래밍 설계> 

### - 요구사항
- 무한중첩 구조도 동작하게 한다. [[[[[]]]]]
- 배열의 원소에는 숫자타입만 존재한다.
- 복잡한 세부로직은 함수로 분리해본다.
- 중복된 코드역시 함수로 분리해서 일반화한다.
- 프로그래밍 설계를 같이 PR한다.
- hint : 중첩문제를 풀기 위해 stack구조를 활용해서 구현할 수도 있다.

### - 설계순서
1. 데이터가 들어오면 scan 함수를 이용하여 쪼갠다.
    
    ```text
    ("[123]" -> "[", "1", "2" ,"3", "]")
    ```

2. tokens 배열에 있는 token들을 parse 함수를 이용하여 분류한다. 
    
    ```text
    <분류 기준>
    1. opening bracket ('[')
    2. numbers
    3. closing bracket (']') 
    4. comma
    ```

    2-1. opening bracket IN

    ```text
    데이터 객체(type, value, child)를 빈 배열 result에 push
    ```

    2-2. 숫자 데이터 IN 

    ```text
    변수 continued 상태에 따라 분류

    2-2-1. continued === false
    result에 들어있는 가장 마지막 데이터의 child에 데이터 객체를 push하고, continued 상태를 true로 변경 
    
    2-2-2. continued === true
    result에 들어있는 가장 마지막 데이터의 child의 value에 값 추가
    ```

    2-3. closing bracket IN

    ```text
    result에 값이 존재하면 result에 들어있는 가장 마지막 데이터를 끝에서 두번째의 데이터의 child에 push
    ```

    2-4. comma IN
    
    ```text
    변수(type, value, child, continued) 값 초기화 
    ```

### - 코드

```javascript
class Data {
    constructor(type, value, child) {
        this.type = type;
        this.value = value;
        this.child = child;
    }
}

function scan(str) {
    let tokens = [];
    for (let token of str){
        tokens.push(token);
    }
    return tokens;
}

function parse(str) {
    const tokens = scan(str);
    
    let type = "";
    let value = "";
    let child = [];

    let result = [];
    let continued = false;

    for(let token of tokens) {
       if(token === '['){
           type = 'array';
           result.push(new Data(type, value, child));
       }
       else if(Number(token) && !continued){
           const lastChild = result[result.length-1].child;
           type = 'number';
           value = token;
           lastChild.push(new Data(type, value));
           continued = true;
       }
       else if(Number(token) && continued){
          const lastChild = result[result.length-1].child;
          lastChild[lastChild.length-1].value += token;
       }
       else if(token === ']' && result.length > 1){
           const lastData = result.pop();
           const lastChild = result[result.length-1].child;
           lastChild.push(lastData);
       }
       else if(token === ','){
          type = "";
          value = "";
          child = [];
          continued = false;
          }
    }
    return result;
}

//test
var str = "[123,[22,23,[11,[112233],112],55],33]";
console.log(JSON.stringify(parse(str), null, 2));
```

### - 결과

```text
[
  {
    "type": "array",
    "value": "",
    "child": [
      {
        "type": "number",
        "value": "123"
      },
      {
        "type": "array",
        "value": "",
        "child": [
          {
            "type": "number",
            "value": "22"
          },
          {
            "type": "number",
            "value": "23"
          },
          {
            "type": "array",
            "value": "",
            "child": [
              {
                "type": "number",
                "value": "11"
              },
              {
                "type": "array",
                "value": "",
                "child": [
                  {
                    "type": "number",
                    "value": "112233"
                  }
                ]
              },
              {
                "type": "number",
                "value": "112"
              }
            ]
          },
          {
            "type": "number",
            "value": "55"
          }
        ]
      },
      {
        "type": "number",
        "value": "33"
      }
    ]
  }
]
```