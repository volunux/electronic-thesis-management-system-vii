export class MailMessagePayload {

  constructor(sender : string , recipient : string , subject : string , body : string) {
    this.sender = sender;
    this.recipient = recipient;
    this.subject = subject;
    this.body = body;
  }

  private sender : string;
  private recipient : string;
  private subject : string;
  private body : string;

  public getSender() : string {
    return this.sender;
  }

  public getRecipient() : string {
    return this.recipient;
  }

  public getSubject() : string {
    return this.subject;
  }

  public getBody() : string {
    return this.body;
  }
}