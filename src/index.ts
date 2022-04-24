import express, { Express } from 'express';
import { AppConfig } from './main/config/AppConfig';
import { ErrorHandler } from './main/entity/error/ErrorHandler';

process.on('uncaughtException' , (err : Error) => { ErrorHandler.handle(err); 
	process.exit(1); });

process.on('unhandledRejection' , (err : Error) => { throw err; });

const app : Express = express();
AppConfig.init(app);