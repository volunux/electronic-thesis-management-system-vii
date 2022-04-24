import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { ThesisStatusController } from '../controller/ThesisStatusController';
import { ThesisStatusRouteConfig } from './config/ThesisStatusRouteConfig';
import { ThesisStatus } from '../entity/ThesisStatus';

export const ThesisStatusRouter : Router = express.Router();
const ctrl : ThesisStatusController = ProxyController.create<ThesisStatusController>(new ThesisStatusController(ThesisStatusRouteConfig.getInstance()));

ThesisStatusRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , ThesisStatusController.setEntity(ThesisStatus));
ThesisStatusRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('ThesisStatus'));
ThesisStatusRouter.get('/' , ctrl.home);
ThesisStatusRouter.get('/entries' , ctrl.findAll);
ThesisStatusRouter.get('/detail/:id' , ctrl.findOne);
ThesisStatusRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
ThesisStatusRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
ThesisStatusRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
ThesisStatusRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisStatusRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);