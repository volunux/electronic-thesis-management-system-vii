import winston , { Logform , format , transports } from 'winston';
import DailyRotateFile , { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import ConfigurationProperties from '../../config/ConfigurationProperties';
import logger from 'morgan';

const eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
export const morganFormat : string = ':method :url :status :res[content-length] - :response-time ms';

// export const transportSettings : DailyRotateFileTransportOptions = {
//   'filename' : 'info-%DATE%.log',
//   'level' : eProps.getLogLevel(),
//   'dirname' : './logs',
//   'datePattern' : 'YYYY-MM',
//   'handleExceptions' : true,
//   'handleRejections' : true,
//   'zippedArchive' : false,
//   'maxSize' : '37mb',
//   'watchLog' : true,
// /*  'options' : {'flags' : 'w'},*/
//   'maxFiles' : 10
// };

// const defaultTransportSettings : DailyRotateFileTransportOptions = transportSettings;
// const errorTransportSettings : DailyRotateFileTransportOptions = Object.assign({} , transportSettings);
// const paymentTransportSettings : DailyRotateFileTransportOptions = Object.assign({} , transportSettings);
// const mailTransportSettings : DailyRotateFileTransportOptions = Object.assign({} , transportSettings);

// paymentTransportSettings['filename'] = 'payment-%DATE%.log';
// mailTransportSettings['filename'] = 'mail-%DATE%.log';
// errorTransportSettings['filename'] = 'error-%DATE%.log';
// errorTransportSettings['level'] = 'error';

// export const defaultTransport : DailyRotateFile = new DailyRotateFile(defaultTransportSettings);
// export const errorTransport : DailyRotateFile = new DailyRotateFile(errorTransportSettings);
export const consoleTransport : transports.ConsoleTransportInstance = new winston.transports.Console({'level' : 'http'});

export const defaultFormat : Logform.Format = format.combine(format.timestamp({'format' : 'YYYY-MM-DD HH:mm:ss'}) , format.errors({'stack' : true}) , format.metadata() , format.json());
