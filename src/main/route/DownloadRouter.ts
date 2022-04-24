import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { DownloadController } from '../controller/DownloadController';
import { DownloadRouteConfig } from '../route/config/DownloadRouteConfig';

export const DownloadRouter : Router = express.Router();
const ctrl : DownloadController = ProxyController.create<DownloadController>(new DownloadController(DownloadRouteConfig.getInstance()));

DownloadRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("download"));
DownloadRouter.get('/' , ctrl.dashboard);
DownloadRouter.get('/entries' , ctrl.entries);
DownloadRouter.get('/thesis/detail/:id/:order' , ctrl.findOne);
DownloadRouter.get('/save/order/:order/thesis/:thesis' , ctrl.userOrderEntryDownload);