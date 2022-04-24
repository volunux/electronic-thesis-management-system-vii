import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { DeliveryMethodController } from '../controller/DeliveryMethodController';
import { DeliveryMethodRouteConfig } from './config/DeliveryMethodRouteConfig';
import { DeliveryMethod } from '../entity/DeliveryMethod';

export const DeliveryMethodRouter : Router = express.Router();
const ctrl : DeliveryMethodController = ProxyController.create<DeliveryMethodController>(new DeliveryMethodController(DeliveryMethodRouteConfig.getInstance()));

DeliveryMethodRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , DeliveryMethodController.setEntity(DeliveryMethod));
DeliveryMethodRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('DeliveryMethod'));
DeliveryMethodRouter.get('/' , ctrl.home);
DeliveryMethodRouter.get('/entries' , ctrl.findAll);
DeliveryMethodRouter.get('/detail/:id' , ctrl.findOne);
DeliveryMethodRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
DeliveryMethodRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
DeliveryMethodRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
DeliveryMethodRouter.post('/delete/entries/many' , ctrl.deleteMany);
DeliveryMethodRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);