import { MailSender } from './MailSender';
import { MailgunSender } from './services/MailgunSender';
import { TwilioSender } from './services/TwilioSender';
import { SendgridSender } from './services/SendgridSender';

export class MailSenderServicesContainer {

  private static serviceList : Map<string , MailSender> = new Map<string , MailSender>();

  static {
    MailSenderServicesContainer.serviceList.set('sendgrid' , SendgridSender.getInstance());
    MailSenderServicesContainer.serviceList.set('twilio' , TwilioSender.getInstance());
    MailSenderServicesContainer.serviceList.set('mailgun' , MailgunSender.getInstance());
  }

  public static getService(name : string) : MailSender | null {
    let mailSender : MailSender | undefined = MailSenderServicesContainer.serviceList.get(name);
    if (mailSender === undefined || mailSender === null) { return null; }
    else { return mailSender; }
  }

  public static addService(name : string , mailSender : MailSender) : void {
    MailSenderServicesContainer.serviceList.set(name , mailSender);
  }
}