import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { LoggerController } from '../controller/LoggerController';
import { LoggerRouteConfig } from '../route/config/LoggerRouteConfig';

export const LoggerRouter : Router = express.Router();
const ctrl : LoggerController = ProxyController.create<LoggerController>(new LoggerController(LoggerRouteConfig.getInstance()));

LoggerRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("log"));
LoggerRouter.get('/' , ctrl.dashboard);
LoggerRouter.get('/entries' , ctrl.entries);
LoggerRouter.get('/entries/audit' , ctrl.auditEntries);
LoggerRouter.get('/detail/:name' , ctrl.entryDetail);
LoggerRouter.get('/download/:name' , ctrl.download);
LoggerRouter.get('/delete/:name' , ctrl.delete);