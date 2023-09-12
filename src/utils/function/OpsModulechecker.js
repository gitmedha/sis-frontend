function isEmptyValue(value) {
    if (value === null || value === undefined) {
      return true;
    }
  
    if (typeof value === 'string' && value.trim() === '') {
      return true;
    }
  
    if (Array.isArray(value) && value.length === 0) {
      return true;
    }
  
    if (typeof value === 'object' && Object.keys(value).length === 0) {
      return true;
    }
  
    return false;
}


export const checkEmptyValuesandplaceNA=(obj) =>{
    const result = {};

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        const isEmpty = isEmptyValue(value);
        if(isEmpty){
          console.log("result[key]",result[key]);
          result[key] = "N/A";
        }
        else{
          result[key]=value
        }
      }
    }

    return result;
  }