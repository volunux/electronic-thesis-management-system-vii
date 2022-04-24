import express , { Router } from 'express';
import { BaseController } from '../controller/abstract/BaseController';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { ThesisReplyController } from '../controller/ThesisReplyController';
import { ThesisReplyRouteConfig } from './config/ThesisReplyRouteConfig';
import { ThesisReply } from '../entity/ThesisReply';

export const ThesisReplyRouter : Router = express.Router();
const ctrl : ThesisReplyController = ProxyController.create<ThesisReplyController>(new ThesisReplyController(ThesisReplyRouteConfig.getInstance()));

ThesisReplyRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-three") , BaseController.setEntity(ThesisReply));
ThesisReplyRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('ThesisReply')).put(ValidationRegister.setSchema('ThesisReply'));
ThesisReplyRouter.get('/' , ctrl.home);
ThesisReplyRouter.get('/entries' , ctrl.findAll);
ThesisReplyRouter.get('/detail/:id' , ctrl.findOne);
ThesisReplyRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisReplyRouter.get('/delete/entries/all' , ctrl.deleteAll);
ThesisReplyRouter.post('/delete/entries/all' , ctrl.findAndDeleteAll);