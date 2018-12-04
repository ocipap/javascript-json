class ErrorChecker{
    validateClosing(data){
        try{
            let openingObj = 0, 
                closingObj = 0, 
                openingArr = 0, 
                closingArr = 0,
                StrSpecialChar = 0;
            for(let v of data){   
                if(v === '{') ++openingObj;
                if(v === '}') ++closingObj;
                if(v === '[') ++openingArr;
                if(v === ']') ++closingArr;
                if(v === '\'') ++StrSpecialChar;
            }
            if(openingObj > closingObj) throw "정상적으로 종료되지 않은 객체가 포함되어 있습니다.";
            if(openingObj < closingObj) throw "객체의 종료가 초과하여 일어났습니다.";
            if(openingArr > closingArr) throw "정상적으로 종료되지 않은 객체가 있습니다.";
            if(openingArr < closingArr) throw "배열의 종료가 초과하여 일어났습니다.";
            if(StrSpecialChar % 2 !== 0) throw "올바르지 않은 문자열이 포함되어 있습니다.";
            return true;
        } catch(err){
            return err;
        }
    }
    validateColon(data){
        try{
            if(data.slice(-1)[0].status !== 'object_value') throw "객체 안에 콜론이 생략되어 있습니다.";
            return true;
        } catch(err) {
            return err;
        }
    }
}

module.exports = ErrorChecker;