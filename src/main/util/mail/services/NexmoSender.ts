import Nexmo , { MessageError , MessageRequestResponse } from 'nexmo';
import winston , { Logger } from 'winston';
import SimpleLogger from '../../other/Logger';
import ConfigurationProperties from '../../../config/ConfigurationProperties';

export class NexmoSender {

  private static instance : NexmoSender;
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly key : string = this.eProps.getNexmoKey();
  private readonly secret : string = this.eProps.getNexmoSecret();
  private readonly nexmo = new Nexmo({'apiKey' : this.key , 'apiSecret' : this.secret} , {'debug' : true});
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : NexmoSender.name});

  private constructor() {}

  public static getInstance() : NexmoSender {
    if (!NexmoSender.instance) { NexmoSender.instance = new NexmoSender(); }
    return NexmoSender.instance;
  }

  public async sendSMS(from : string , to : string , text : string) : Promise<void> {
    this.nexmo.message.sendSms(from , to , text , {'type' : 'unicode'} , (err : MessageError , response : MessageRequestResponse) => {
      if (err) { this.logger.error(err); }
      else { this.logger.info(response); } });
  }


}