import { Response } from 'express';
import { Logger } from 'winston';
import ConfigurationProperties from '../../config/ConfigurationProperties';
import SimpleLogger from '../../util/other/Logger';
import { MailMessage } from '../../util/mail/MailMessage';
import { MailMessagePayload } from '../../util/mail/MailMessagePayload';
import { MailSender } from '../../util/mail/MailSender';
import { User } from '../../entity/User';

export class MailHelper {

  private static readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private static readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': MailHelper.name });

  public static sendEmail(service: MailSender | null, user: User, mailMessage: MailMessage): void {
    let sender: string = this.eProps.getEmailAddress();
    let email_address: string = user.getEmailAddress() && user.getEmailAddress().trim() ? user.getEmailAddress().trim() : sender;
    let mailMessagePayload: MailMessagePayload = new MailMessagePayload(sender, email_address, mailMessage.getSubject(), mailMessage.getBody());
    if (service !== null) { service.send(mailMessagePayload.getSender(), mailMessagePayload.getRecipient(), mailMessagePayload.getSubject(), mailMessagePayload.getBody()); }
  }

  public static renderTemplateAndSend(res: Response, fileName: string, service: MailSender | null, mailMessage: MailMessage, user: User, data: { [key: string]: any }): void {
    data['layout'] = "";
    res.render(fileName, data, function(err: Error, html: string): void {
      if (err) { MailHelper.logger.error(err); }

      mailMessage.setBody(html);
      MailHelper.sendEmail(service, <any>user, mailMessage);
    });
  }
}