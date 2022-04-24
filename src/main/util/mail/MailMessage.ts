export interface MailMessage {
  getSubject() : string;
  getBody() : string;
  setBody(body : string) : void;

}