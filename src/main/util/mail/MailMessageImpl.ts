export class MailMessageImpl {

  constructor(subject : string , body : string) {
    this.subject = subject;
    this.body = body; 
  }

  private subject : string;
  private body : string;

  public getSubject() : string {
    return this.subject;
  }

  public getBody() : string {
    return this.body;
  }

  public setBody(body : string) : void {
    this.body = body;
  }

}