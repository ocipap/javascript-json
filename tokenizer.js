module.exports = class Tokenizer {
    constructor() {
        this.tokenList = [];
        this.token = '';
        this.bStr = false;
        this.bStrOpen = false;
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
    throwWrongString() {
        if (this.bStrOpen) throw `${this.token}은 올바른 문자열이 아닙니다.`;
    }
    run(str) {
        for (let char of str) {
            if (this.bStrOpen) {
                if (char === "'") {
                    this.bStrOpen = !this.bStrOpen;
                    this.bStr = !this.bStr;
                }
                this.concat(this.token, char);
            }
            else if (char.match(/\[|\{|\:/)) {
                this.concat(this.token, char);
                this.push(this.token.trim());
                this.initToken();
            }
            else if (char.match(/,|\]|\}/)) {
                this.throwWrongString();

                if (this.token) this.push(this.token.trim());
                if (char !== ',') this.push(char);
                this.initToken();
                this.bStr = false;
            }
            else {
                if (char === "'") this.bStrOpen = !this.bStrOpen;
                this.concat(this.token, char);
                if (this.bStr) this.throwWrongString();
            }
        }

        //올바르지 않은 문자열 검출
        this.throwWrongString();

        if (this.token) this.push(this.token.trim());

        return this.tokenList;
    }
}