import Twilio from 'twilio';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import { MailSender } from '../MailSender';
import winston , { Logger } from 'winston';
import SimpleLogger from '../../other/Logger';

export class TwilioSender implements MailSender {

  private static instance : TwilioSender;
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : TwilioSender.name});
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly accountSid : string = this.eProps.getTwilioSid();
  private readonly authToken : string = this.eProps.getTwilioAuthToken();
  private readonly phoneNumber : string = this.eProps.getTwilioPhoneNumber();
  private readonly phoneNumberTrial : string = this.eProps.getTwilioPhoneNumberTrial();
  private readonly client : Twilio.Twilio = Twilio(this.accountSid , this.authToken);

  private constructor() { }

  public static getInstance() : TwilioSender {
    if (!TwilioSender.instance) { TwilioSender.instance = new TwilioSender(); }
    return TwilioSender.instance;
  }

  public async send(sender : string , recipient : string , subject : string , body : string) : Promise<void> {
    try {
      let response : any = await this.client.messages.create({
        'from' : this.phoneNumber ,
        'to' : this.phoneNumberTrial ,
        'body' : body });
      this.logger.info(response); }
    catch(err : any) { this.logger.error(err); }
  }

}