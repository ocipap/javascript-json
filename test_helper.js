    class testObj{
        constructor(value){
            this.result = value; 
        }
        toBe(value){
            return (this.result === value)? true: `false(targetValue is ${this.result}, expectValue is ${value})`;
        }
    }

    exports.expect = (value) => new testObj(value);
    exports.test = (str, fnc) => console.log(`${str}: ${fnc()}`);