class SyntaxError {
    throwWrongString(string) {
        throw `${string}은 올바른 문자열이 아닙니다.`;
    }

    throwWrongArray() {
        throw `정상적으로 종료되지 않은 배열이 있습니다.`;
    }

    throwWrongObject() {
        throw `정상적으로 종료되지 않은 객체가 있습니다.`;
    }

    throwNotDefinedKey() {
        throw `key가 정의되지 않았습니다.`
    }

    throwNotDefinedValue(key) {
        throw `${key}의 value가 정의되지 않았습니다.`
    }

    throwMissingColon() {
        throw `':'이 누락된 객체표현이 있습니다.`;
    }

    throwWrongComma() {
        throw `연속된 ','가 존재합니다.`
    }
}

exports.toBeData = {
    tokenList: [],
    token: '',
    bStr: false,
    bStrOpen: false,
    arrayStack: 1,
    objectStack: 0,
    key: '',
    bKeyAvailable: false,
    bValueAvailable: false,
    type: {},
    stateList: ['array'],
    syntaxError: new SyntaxError
}

