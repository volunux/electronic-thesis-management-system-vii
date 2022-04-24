import express , { Router } from 'express';
import { BaseController } from '../controller/abstract/BaseController';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ThesisCommentController } from '../controller/ThesisCommentController';
import { ThesisCommentRouteConfig } from './config/ThesisCommentRouteConfig';
import { ThesisComment } from '../entity/ThesisComment';

export const ThesisCommentRouter : Router = express.Router();
const ctrl : ThesisCommentController = ProxyController.create<ThesisCommentController>(new ThesisCommentController(ThesisCommentRouteConfig.getInstance()));

ThesisCommentRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-three") , BaseController.setEntity(ThesisComment));
ThesisCommentRouter.get('/' , ctrl.home);
ThesisCommentRouter.get('/entries' , ctrl.findAll);
ThesisCommentRouter.get('/detail/:id' , ctrl.findOne);
ThesisCommentRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisCommentRouter.get('/delete/entries/all' , ctrl.deleteAll);
ThesisCommentRouter.post('/delete/entries/all' , ctrl.findAndDeleteAll);