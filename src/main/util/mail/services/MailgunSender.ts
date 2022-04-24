import path from 'path';
import { Logger } from 'winston';
import Mailgun from 'mailgun-js';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import { MailSender } from '../MailSender';
import SimpleLogger from '../../other/Logger';

export class MailgunSender implements MailSender {

  private constructor() { }

  private static instance: MailgunSender;
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': MailgunSender.name });
  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly domain: string = this.eProps.getMailgunDomain();
  private readonly key: string = this.eProps.getMailgunPrivateKey();
  private readonly emailAddress: string = this.eProps.getEmailAddress();
  private readonly mailgun: Mailgun.Mailgun = new Mailgun({ 'apiKey': this.key, 'domain': this.domain } as any);

  public static getInstance(): MailgunSender {
    if (!MailgunSender.instance) { MailgunSender.instance = new MailgunSender(); }
    return MailgunSender.instance;
  }

  public async send(from: string, to: string, subject: string, body: string): Promise<void> {
    await this.sendMessage(this.getBody(from, to, '', body));
  }

  public async sendHtml(from: string, to: string, subject: string, html: string): Promise<void> {
    await this.sendMessage(this.getBody(from, to, subject, html));
  }

  public async sendwithAttachment(from: string, to: string, subject: string, html: string, text: string, filePath: string): Promise<void> {
    await this.sendMessage(this.getBody(from, to, subject, html, text, filePath));
  }

  private async sendMessage(message: Mailgun.messages.SendData): Promise<void> {
    try {
      let response: Mailgun.messages.SendResponse = await this.mailgun.messages().send(message);
      this.logger.info(response);
    }
    catch (err: any) { this.logger.error(err); }
  }

  private getBody(from: string, to: string, subject: string, html?: string, text?: string, filePath?: string): Mailgun.messages.SendData {
    let body: Mailgun.messages.SendData = {
      'from': from,
      'to': to,
      'subject': subject
    };

    if (html) { body['html'] = html; }
    if (text) { body['text'] = text; }
    if (filePath) {
      let file: string = path.join(__dirname, filePath);
      body['attachment'] = file;
    }
    return body;
  }

}