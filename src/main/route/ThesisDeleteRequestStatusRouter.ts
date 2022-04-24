import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { ThesisDeleteRequestStatusController } from '../controller/ThesisDeleteRequestStatusController';
import { ThesisDeleteRequestStatusRouteConfig } from './config/ThesisDeleteRequestStatusRouteConfig';
import { ThesisDeleteRequestStatus } from '../entity/ThesisDeleteRequestStatus';

export const ThesisDeleteRequestStatusRouter : Router = express.Router();
const ctrl : ThesisDeleteRequestStatusController = ProxyController.create<ThesisDeleteRequestStatusController>(new ThesisDeleteRequestStatusController(ThesisDeleteRequestStatusRouteConfig.getInstance()));

ThesisDeleteRequestStatusRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , ThesisDeleteRequestStatusController.setEntity(ThesisDeleteRequestStatus));
ThesisDeleteRequestStatusRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('ThesisDeleteRequestStatus'));
ThesisDeleteRequestStatusRouter.get('/' , ctrl.home);
ThesisDeleteRequestStatusRouter.get('/entries' , ctrl.findAll);
ThesisDeleteRequestStatusRouter.get('/detail/:id' , ctrl.findOne);
ThesisDeleteRequestStatusRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
ThesisDeleteRequestStatusRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
ThesisDeleteRequestStatusRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
ThesisDeleteRequestStatusRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisDeleteRequestStatusRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);