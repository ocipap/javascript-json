const testSet = {
    testObj: { 
        targetValue: undefined,
        testValue: undefined,
        toBe(targetValue) {
            this.targetValue = targetValue;
            if (this.testValue === targetValue) return 'OK'
            return 'FAIL'
        },
        toBeSame(targetValue) {
            this.targetValue = targetValue
            const test = this.testValue;
            const type = Object.prototype.toString.call(test);
            if (type !== Object.prototype.toString.call(targetValue)) return 'FALSE';

            if (type !== '[object Array]') return this.toBe(targetValue);

            const testLen = type === '[object Array]' ? test.length : Object.keys(test).length;
            const targetLen = type === '[object Array]' ? targetValue.length : Object.keys(targetValue).length;
            if (testLen !== targetLen) return 'FALSE';

            const compare = function (item1, item2) {
                const itemType = Object.prototype.toString.call(item1);
                if (['object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                    if (!toBeSame(item1, item2)) return 'FALSE';
                } else {
                    if (itemType !== Object.prototype.toString.call(item2)) return 'FALSE';
                    else {
                        if (item1 !== item2) return 'FALSE';
                    }
                }
            }

                for (let i = 0; i < testLen; i++) {
                    if (compare(test[i], targetValue[i]) === 'FALSE') return 'FALSE';
                }
            return 'TRUE'
        }
    },

    expect(testValue) {
        this.testObj.testValue = testValue;
        return this.testObj;
    },

    test(msg, fn) {
        const result = fn();
        const printMsg = `${msg} : ${result} (testValue is ${this.testObj.testValue}, targetValue is ${this.testObj.targetValue})`;
        console.log(printMsg);
    }
}

module.exports = testSet;