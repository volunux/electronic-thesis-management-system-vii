export interface MailSender {

 send(sender : string , recipient : string , subject : string , body : string) : Promise<void>;
}