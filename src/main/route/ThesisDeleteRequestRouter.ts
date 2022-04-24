import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { ThesisDeleteRequestController } from '../controller/ThesisDeleteRequestController';
import { ThesisDeleteRequestRouteConfig } from './config/ThesisDeleteRequestRouteConfig';

export const ThesisDeleteRequestRouter : Router = express.Router();
const ctrl : ThesisDeleteRequestController = ProxyController.create<ThesisDeleteRequestController>(new ThesisDeleteRequestController(ThesisDeleteRequestRouteConfig.getInstance()));

ThesisDeleteRequestRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("thesis-delete-request"));
ThesisDeleteRequestRouter.get('/' , ctrl.home);
ThesisDeleteRequestRouter.get('/entries' , ctrl.findAll);
ThesisDeleteRequestRouter.get('/detail/:id' , ctrl.findOne);
ThesisDeleteRequestRouter.post('/detail/:id' , ThesisDeleteRequestController.setThesisDeleteRequest , ValidationRegister.setSchema('ThesisDeleteRequest') , ctrl.update);
ThesisDeleteRequestRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisDeleteRequestRouter.get('/delete/entries/all' , ctrl.deleteAll);
ThesisDeleteRequestRouter.post('/delete/entries/all' , ctrl.findAndDeleteAll);