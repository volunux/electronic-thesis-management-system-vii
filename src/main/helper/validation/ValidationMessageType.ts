export abstract class ValidationMessageType {

  public static isRequired() : string {
    return "should be provided and cannot be empty.";
  }

  public static minLength(length : number) : string {
    return "cannot be less than " + length + " characters in length.";
  }

  public static maxLength(length : number) : string {
    return "cannot be greater than " + length + " characters in length."
  }

  public static isEmpty() : string {
    return ValidationMessageType.isRequired();
  }

  public static only() : string {
    return "should be selected from existing list.";
  }

  public static pattern() : string {
    return "does not match required pattern.";
  }

  public static base(type : string) : string {
    return "should only be of type " + type + " .";
  }

  public static getStringInstance(isRequired : boolean , minLength : number , maxLength : number , isEmpty : boolean , pattern : boolean , dataType : string) {
    return {
      'any' : { 
        'required' : ValidationMessageType.isRequired() ,
        'only' : ValidationMessageType.only() } ,
      'string' : {  
        'min' : ValidationMessageType.minLength(minLength) ,
        'max' : ValidationMessageType.maxLength(maxLength) ,
        'empty' : ValidationMessageType.isEmpty() ,
        'pattern' : ValidationMessageType.pattern() ,
        'base' : ValidationMessageType.base(dataType) } }
  }

  public static getArrayInstance(isRequired : boolean , minLength : number , maxLength : number , isEmpty : boolean , pattern : boolean , dataType : string) {
    return {
      'any' : { 
        'required' : ValidationMessageType.isRequired() ,
        'only' : ValidationMessageType.only() } ,
      'array' : { 
        'min' : ValidationMessageType.minLength(minLength) ,
        'max' : ValidationMessageType.maxLength(maxLength) ,
        'empty' : ValidationMessageType.isEmpty() ,
        'pattern' : ValidationMessageType.pattern() ,
        'base' : ValidationMessageType.base(dataType) } }
  }

  public static getIntegerInstance(isRequired : boolean , minLength : number , maxLength : number , isEmpty : boolean , pattern : boolean , dataType : string) {

    return {
      'any' : { 
        'required' : ValidationMessageType.isRequired() ,
        'only' : ValidationMessageType.only() } ,
      'number' : {  
        'min' : ValidationMessageType.minLength(minLength) ,
        'max' : ValidationMessageType.maxLength(maxLength) ,
        'empty' : ValidationMessageType.isEmpty() ,
        'pattern' : ValidationMessageType.pattern() ,
        'base' : ValidationMessageType.base(dataType) } }

  }
}