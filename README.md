# javascript-json
레벨2지식  

**tokenizer**  
토큰 단위로 쪼개기

**lexer**  
의미 부여하기

**parser**  
데이터 구조화 시키기

### 에러 구조화

**lexer 에서 걸러야 하는 것**

- type 이 불분명한 요소들 에러처리
- 해당 요소가 올바른 형태인지 판별

**parser 에서 걸러야 할 것**

- 배열의 비정상적인 종료
- 누락된 seperator

### 내가 생각하는 플로우

우선 tokenizer로 배열을 의미있는 단위로 자른다.(tokenizer)  

그 후 자른 원소들을 순회하면서 type과 value를 파악한다. (lexer)  

type과 value를 보면서 구조화를 시킨다. (parser)
