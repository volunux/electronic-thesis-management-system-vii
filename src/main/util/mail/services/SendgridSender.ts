import Sendgrid , { MailDataRequired } from '@sendgrid/mail';
import winston , { Logger } from 'winston';
import SimpleLogger from '../../other/Logger';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import { MailSender } from '../MailSender';

export class SendgridSender implements MailSender {

  private static instance : SendgridSender;
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : SendgridSender.name});

  private constructor() {}

  public static getInstance() : SendgridSender {
    if (!SendgridSender.instance) { SendgridSender.instance = new SendgridSender(); }
    return SendgridSender.instance;
  }

  public async send(sender : string , recipient : string , subject : string , body : string) : Promise<void> {
    const context : SendgridSender = this;
    Sendgrid.setApiKey(this.eProps.getSendgridKey());

    try {
      let response : MailDataRequired = {
        'from' : sender ,
        'to' : recipient ,
        'subject' : subject ,
        'html' : body };

     Sendgrid.send(response , false , function(err : Error , result : any) {
      if (err) { context.logger.error(err); }

      else { context.logger.info(result); } }); }

    catch(err : any) { context.logger.error(`Network failure has occured. Please check connection and try again.`); }
  }

}