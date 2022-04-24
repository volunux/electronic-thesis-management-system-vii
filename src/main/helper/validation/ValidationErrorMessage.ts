export class ValidationErrorMessage {

  constructor(data? : any) {

    if (data) {
      this.message = data.message ? data.message : undefined;
      this.path = data.path ? data.path : undefined;
      this.field_name = data.field_name ? data.field_name : undefined; 
    }
  }

  private message : string;
  private path : string;
  private field_name : string;

  public getMessage() : string {
    return this.message;
  }

  public getPath() : string {
    return this.path;
  }

  public getFieldName() : string {
    return this.field_name;
  }

  public setMessage(message : string) : void {
    this.message = message;
  }

  public setPath(path : string) : void {
    this.path = path;
  }

  public setFieldName(field_name : string) : void {
    this.field_name = field_name;
  }

  public static getInstance(length : number) : ValidationErrorMessage[] {
    let validationErrorMessages : ValidationErrorMessage[] = [];
    if (length == 0 || length == 1) return [new ValidationErrorMessage({})];
    else { for (let i = 0; i < length; i++) { validationErrorMessages[i] = new ValidationErrorMessage({}); } }
    return validationErrorMessages;
  }

}