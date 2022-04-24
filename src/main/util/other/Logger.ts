import winston , { Logger , format , transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { /*defaultTransport , errorTransport , */defaultFormat , consoleTransport } from './logging-settings';

export default class SimpleLogger {

  private static logLevels : { [key : string] : number };
  protected static instance : Logger | null;

  static {
    this.logLevels = {
      fatal: 0,
      error: 1,
      warn: 2,
      info: 3,
      http : 4,
      debug: 5,
      trace: 6,
    };
  }

   public static getLogger(context? : string) : Logger {
    if (!SimpleLogger.instance) {
      this.instance = winston.createLogger({
        'level' : 'info' ,
        'format' : defaultFormat,
        'handleExceptions' : true ,
        'handleRejections' : true,
        'levels' : this.logLevels ,
        'transports' : [ consoleTransport , /*errorTransport as any, defaultTransport as any*/] }); }
    return this.instance as Logger;
   }
}