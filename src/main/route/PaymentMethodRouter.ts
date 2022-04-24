import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { PaymentMethodController } from '../controller/PaymentMethodController';
import { PaymentMethodRouteConfig } from './config/PaymentMethodRouteConfig';
import { PaymentMethod } from '../entity/PaymentMethod';

export const PaymentMethodRouter : Router = express.Router();
const ctrl : PaymentMethodController = ProxyController.create<PaymentMethodController>(new PaymentMethodController(PaymentMethodRouteConfig.getInstance()));

PaymentMethodRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , PaymentMethodController.setEntity(PaymentMethod));
PaymentMethodRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('PaymentMethod'));
PaymentMethodRouter.get('/' , ctrl.home);
PaymentMethodRouter.get('/entries' , ctrl.findAll);
PaymentMethodRouter.get('/detail/:id' , ctrl.findOne);
PaymentMethodRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
PaymentMethodRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
PaymentMethodRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
PaymentMethodRouter.post('/delete/entries/many' , ctrl.deleteMany);
PaymentMethodRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);