import { Logger } from 'winston';
import SimpleLogger from '../../other/Logger';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import Https from 'https';
import Querystring from 'querystring';
import Request from 'request';

export class ElksSender {

  private static instance : ElksSender;
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly username : string = this.eProps.getElksUsername();
  private readonly password : string = this.eProps.getElksPassword();
  private readonly url : string = 'https://api.46elks.com/a1/SMS';
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : ElksSender.name});

  private constructor() { }

  public static getInstance() : ElksSender {
    if (!ElksSender.instance) { ElksSender.instance = new ElksSender(); }
    return ElksSender.instance;
  }

  public async sendSMS(from : string , to : string , text : string) : Promise<void> {
    const message = {
      'from' : from ,
      'to' : to ,
      'message' : text
    };
    const postData : string = Querystring.stringify(message);
    const key : string = Buffer.from(this.username + ':' + this.password).toString('base64');
    const options : Https.RequestOptions = {
      'hostname' : 'api.46elks.com' ,
      'path' : '/a1/SMS' ,
      'method' : 'POST' ,
      'headers' : { 'Authorization' : 'Basic ' + key }
    };

    let request = Https.request(options , (response : any) => { let str = "";
      response.on('data' , (chunk : any) => { str += chunk; });
      response.on('end' , (data : any) => { this.logger.info(str); });  });
    request.write(postData);
  }

  public async sendSMSII(from : string , to : string , text : string) : Promise<void> {
    try { let response : Request.Request = await Request.post(this.url , this.getBody(from , to , text)); }
    catch (err : any) { this.logger.error(err); }
  }

  private getBody(from : string , to : string , text : string) : Request.CoreOptions {
    let body : Request.CoreOptions = {
    'auth' : {
      'user' : this.username ,
      'pass' : this.password } ,
    'form' : {
      'from' : from ,
      'to' : to ,
      'message' : text } };
      return body;
  }

}