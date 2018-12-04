"use strict";

const _root = new WeakMap();
class Parser{
  constructor(dataType){
    _root.set(this, []);
    this.dataType = dataType;
    this.token = {
      divisionPoint : ['[', ']', '}', '{', ':', ',', "\"", "\'"],
      bracket : ['[', ']', '}', '{'],
      specialChar : ["\"", "\'"]
    }
  }
  processData(data){
    let target = 0, value, parent, strStatus = 'close', curr = _root.get(this);
    this.dataType.findClosingError(data);
    for(let input of data){
      target++;
      if(!this.token.divisionPoint.includes(input)) continue;
      value = this.getValue(data, target, input, strStatus);
      if(value === undefined) continue;
      [curr, parent, strStatus] = this.setValue({value, curr, parent, input, strStatus});
    }
    return _root.get(this);
  }
  getValue(data, target, input, strStatus){
    let value;
    if(strStatus === 'open') return 'open string';
    if(this.token.specialChar.includes(input)){
      value = this.getStrValue(data, target);
    } else {
      value = this.getOtherValue(data, target, input);
    }
    return value;
  }
  getStrValue(data, target){
      return data.substring(target, data.indexOf("'", target));
  }
  getOtherValue(data, target){
    const divisionPoint = [...this.token.divisionPoint];
    const compareValues = divisionPoint.map(v => data.indexOf(v, target));    
    const stopPoint = compareValues.reduce((acc, curr) => {
      if(curr === -1) return acc;
      if(acc === -1 || acc > curr) return curr;
      return acc;
    });
    if(stopPoint === -1) return;
    return data.substring(target, stopPoint);
  }
  setValue({value, curr, parent, input, strStatus}){
    let trimValue, type, status;
    trimValue = this.trimData(value);
    type =  this.dataType.check(trimValue);
    
    if(this.token.specialChar.includes(input)){
      strStatus = this.setStrValue({strStatus});
    }
    if(strStatus !== 'open'){
      if(this.token.bracket.includes(input) ){
        [curr, parent, strStatus] = this.setBracketValue({curr, parent, input, strStatus});
      }
    }
    if(value !== 'open string' && trimValue !== ''){
      status = this.checkObjStatus(parent, curr);
      curr.push({ status, value: trimValue, type, child: [], parent: parent, });  
    }
    return [curr, parent, strStatus];
  }
  setBracketValue({curr, parent, input, strStatus}){
    if(parent && parent.parent && input === ']' || input === '}'){
      console.log(curr);
      if(input === '}') this.dataType.findColonError(curr);
      parent = parent.parent;
      curr = parent.child;
    }
    if(input  === '{' || input === '['){
      const status = this.checkObjStatus(parent, curr);
      curr.push({ status, type: (input === '[')? 'array': 'object', child: [], parent: parent, });
      parent = curr.slice(-1)[0];
      curr = curr.slice(-1)[0].child;
    }
    return [curr, parent, strStatus];
  }
  setStrValue({strStatus}){
    if(strStatus === 'close'){
      strStatus = 'open';
    } else if(strStatus === 'open'){
      strStatus = 'close';
    }
    return strStatus;
  }
  checkObjStatus(parent, curr){
    let status;
    if(parent && parent.type === 'object') {
        status = 'object_key';
        if(curr.slice(-1)[0] && curr.slice(-1)[0].status === 'object_key') status = 'object_value';
        if(curr.slice(-1)[0] && curr.slice(-1)[0].status === 'object_value') status = 'object_key';
    }     
    return status;
  }
  trimData(data){
    return  data.split("")
                .map(v => v.trim())
                .filter(v => v !== "")
                .join("");
  }
}

module.exports = Parser;