exports.Tokenizer = class {
    constructor() {
        this.tokenList = [];
        this.token = '';
        this.bStr = false;
        this.bStrOpen = false;
        this.arrayStack = 0;
        this.objectStack = 0;
        this.key = '';
        this.bKeyAvailable = false;
        this.bValueAvailable = false;
        this.type;
        this.stateList = [];
        this.syntaxError = new SyntaxError;
    }

    push(token) {
        this.tokenList.push(token);
    }

    initToken() {
        this.token = '';
    }

    concat(token, char) {
        this.token = token + char;
    }

    processByType(char) {
        this.type = {
            '['() {
                this.stateList.push('array');
                this.arrayStack++;
            },

            '{'() {
                this.stateList.push('object');
                this.objectStack++;
                this.bKeyAvailable = true;
            },

            ':'() {
                if (!this.token.trim()) {
                    this.syntaxError.throwNotDefinedKey();
                }
                else {
                    this.key = this.token.trim();
                    this.bKeyAvailable = false;
                    this.bValueAvailable = true;
                }
            },

            ','() {
                if (!this.token.trim()) this.syntaxError.throwWrongComma();

                const currentState = this.stateList[this.stateList.length - 1];
                if (currentState === 'object' && this.bValueAvailable) {
                    this.bKeyAvailable = true;
                    this.bValueAvailable = false;
                }
            },

            ']'() {
                if (!this.arrayStack) this.syntaxError.throwWrongArray();

                this.arrayStack--;
                this.stateList.pop();
            },

            '}'() {
                if (!this.objectStack) this.syntaxError.throwWrongObject();
                if (this.bKeyAvailable && this.token.trim()) this.syntaxError.throwMissingColon();
                if (this.bValueAvailable && !this.token.trim()) this.syntaxError.throwNotDefinedValue(this.key);

                this.objectStack--;
                this.stateList.pop();
            }
        }
        this.type[char].call(this);
    }

    run(str) {
        for (let char of str) {
            if (this.bStrOpen) {
                if (char === "'") {
                    this.bStr = true;
                    this.bStrOpen = false;
                }
                this.concat(this.token, char);
            }
            else if (char.match(/\[|\{|\:/)) {
                this.processByType(char);

                this.concat(this.token, char);
                this.push(this.token.trim());
                this.initToken();
            }
            else if (char.match(/,|\]|\}/)) {
                if (this.bStr && this.bStrOpen) this.syntaxError.throwWrongString(this.token);

                this.processByType(char);

                if (this.token.trim()) this.push(this.token.trim());
                this.initToken();
                if (char !== ',') this.token += char;
                this.bStr = false;
            }
            else {
                if (char === "'") this.bStrOpen = true;
                if (this.bStr && this.bStrOpen) this.syntaxError.throwWrongString(this.token);

                this.concat(this.token, char);
            }
        }

        //error 검출
        if (this.bStrOpen) this.syntaxError.throwWrongString(this.token);
        if (this.objectStack) this.syntaxError.throwWrongObject();
        if (this.arrayStack) this.syntaxError.throwWrongArray();

        if (this.token) this.push(this.token);


        return this.tokenList;
    }
}

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