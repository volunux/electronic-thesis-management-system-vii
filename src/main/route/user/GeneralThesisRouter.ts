import express , { Router } from 'express';
import { ProxyController } from '../../util/proxy/ProxyController';
import { GeneralThesisController } from '../../controller/user/GeneralThesisController';
import { GeneralThesisRouteConfig } from '../config/GeneralThesisRouteConfig';
import { BaseController } from '../../controller/abstract/BaseController';
import { ThesisComment } from '../../entity/ThesisComment';
import { ThesisReply } from '../../entity/ThesisReply';
import { ValidationRegister } from '../../helper/validation/register';
import { LayoutConfigurer } from '../../helper/view/LayoutConfigurer';
import { GeneralMiddleware } from '../../helper/middleware/GeneralMiddleware';

export const GeneralThesisRouter : Router = express.Router();
const ctrl : GeneralThesisController = ProxyController.create<GeneralThesisController>(new GeneralThesisController(GeneralThesisRouteConfig.getInstance()));

GeneralThesisRouter.use('/' , LayoutConfigurer.setLayout('main') , GeneralMiddleware.searchFilter , GeneralMiddleware.pageFiltering);
let manyEntriesRoutes : string[] = ['/' , '/entries' , '/thesis' , '/thesis/entries'];
GeneralThesisRouter.get(manyEntriesRoutes , LayoutConfigurer.setLayout('main') , ctrl.setEntityAttr , ctrl.findAll);
GeneralThesisRouter.use('/thesis/detail' , LayoutConfigurer.setLayout('main') , ctrl.setEntityAttr);

GeneralThesisRouter.get('/thesis/detail/:id/' , ctrl.findOne);
GeneralThesisRouter.get('/thesis/detail/:slug/:id/comment' , ctrl.findDiscussion);
GeneralThesisRouter.get('/thesis/detail/:id/add-comment' , ctrl.addComment);
GeneralThesisRouter.post('/thesis/detail/:id/add-comment' , BaseController.setEntity(ThesisComment) , ValidationRegister.setSchema('Discussion') , ctrl.saveComment);
GeneralThesisRouter.get('/thesis/detail/:slug/:id/comment/:comment/reply' , ctrl.addReply);
GeneralThesisRouter.post('/thesis/detail/:slug/:id/comment/:comment/reply' , BaseController.setEntity(ThesisReply) , ValidationRegister.setSchema('Discussion') , ctrl.saveReply);