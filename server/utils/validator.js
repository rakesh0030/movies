
/*
Validate string - > Input string ,  obj { max , min , charsNotAllowed}

return { isValidate : true/false, message : null(In case of null) otherwise proper message 
  what is wrong

 */
const validateString = (input , validateObj) => {
  //Check for Type if string 
  if(!typeof input == "string"){
    //TODO : wherever I m recieving this message apppend to it the field 
    //due to which the error occured.
    return {
      isValidate : false,
      message : "Field must be a string."
    }
  }

  if(typeof validateObj == "object"){
    for(key in validateObj){
      switch(key) {
        case "max" :
          if(input.length > validateObj.max){
            return {
              isValidate : false,
              message : `Field's length must be less than ${validateObj.max}`
            }
          }
          break;
        case "min" :
          if(input.length < validateObj.min){
            return {
              isValidate : false,
              message : `Field's length must be greater than ${validateObj.min}`
            }
          } 
          break;
        case "charsNotAllowed" :
          if(Array.isArray(validateObj.charsNotAllowed)){
            for(let i=0;i<validateObj.charsNotAllowed.length;i++){
              let c = validateObj.charsNotAllowed[i];
              //console.log("c is",c);
              if(input.includes(c)){
                return {
                  isValidate : false,
                  message : `Field's must not have ${c} in it.`
                }
              }
            }
          }
          break;
        default:
          break;
        } 
    }
    return {
      isValidate : true,
      message : null
    }
  }
}

const validateInteger = (input , validateObj) => {
  //Check for Type if integer 
  if(!Number.isInteger(input)){
    //TODO : wherever I m recieving this message apppend to it the field 
    //due to which the error occured.
    return {
      isValidate : false,
      message : "Field must be a integer."
    }
  }

  if(typeof validateObj == "object"){
    for(key in validateObj){
      switch(key) {
        case "max" :
          if(input > validateObj.max){
            return {
              isValidate : false,
              message : `Field's value must be less than ${validateObj.max}`
            }
          }
          break;
        case "min" :
          if(input < validateObj.min){
            return {
              isValidate : false,
              message : `Field's value must be greater than ${validateObj.min}`
            }
          } 
          break;
        default:
          break;
        } 
    }
    return {
      isValidate : true,
      message : null
    }
  }
}

const validateFloat = (input , validateObj) => {
  //Check for Type if number 
  if(typeof input != "number"){
    //TODO : wherever I m recieving this message apppend to it the field 
    //due to which the error occured.
    return {
      isValidate : false,
      message : "Field must be a number."
    }
  }

  if(typeof validateObj == "object"){
    for(key in validateObj){
      switch(key) {
        case "max" :
          if(input > validateObj.max){
            return {
              isValidate : false,
              message : `Field's value must be less than ${validateObj.max}`
            }
          }
          break;
        case "min" :
          if(input < validateObj.min){
            return {
              isValidate : false,
              message : `Field's value must be greater than ${validateObj.min}`
            }
          } 
          break;
        default:
          break;
        } 
    }
    return {
      isValidate : true,
      message : null
    }
  }
}


//TODO : If time permit, make validate Boolena
//TODO : Add date creation if time permit.


module.exports = {
  validateFloat,
  validateString,
  validateInteger
}