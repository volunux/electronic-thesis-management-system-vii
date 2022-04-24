import { ValidationErrorMessage } from './ValidationErrorMessage';

export class ValidationErrors {

  constructor(messageList : string[]) {

    this.messageList = messageList;
    this.validationErrorMessages = {};
  }

  private messageList : string[] | null;
  private validationErrorMessages : { [key : string] : ValidationErrorMessage };

  public isEmpty() : boolean {
    return this.messageList !== null ? this.messageList.length < 1 : false;
  }

  public getErrors() : string[] | null {
    return this.messageList !== null ? this.messageList : null;
  }

  public getValidationErrorMessages() : { [key : string] : ValidationErrorMessage } {
    return this.validationErrorMessages;
  }

  public addError(error : string) : void {
    if (this.messageList !== null) this.messageList.push(error);
  }

  public addManyError(errors : string[]) : void {
    if (this.messageList !== null) this.messageList.push(...errors);
  }

  public clear() : void {
    this.messageList = [];
  }

  public addManyValidationMessage(errors : ValidationErrorMessage[]) : void {
    errors.forEach((error : ValidationErrorMessage) => { this.validationErrorMessages[error.getPath()] = error;
    });
  }
}