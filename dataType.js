class DataType{
    constructor(error){
        this.error = error;
    }
    check(data){
        if(data === '') return;
        if(this.isBoolean(data)) return 'boolean';
        if(this.isNull(data)) return 'null';
        if(this.isNumber(data)) return 'number';
        return 'string';
    }
    isString(value){
        return !!(value.includes("'") | value.includes('"'));
    }
    isBoolean(value){
        return value === 'true' || value === 'false';
    }
    isNull(value){
        return value === 'null';
    }
    isNumber(value){
        return !!(value.match(/^[0-9]*$/));
    }
    findClosingError(data){
        this.error.validateClosing(data);
    }
    findColonError(data){
        this.error.validateColon(data);
    }
}

module.exports = DataType;