import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { OrderStatusController } from '../controller/OrderStatusController';
import { OrderStatusRouteConfig } from './config/OrderStatusRouteConfig';
import { OrderStatus } from '../entity/OrderStatus';

export const OrderStatusRouter : Router = express.Router();
const ctrl : OrderStatusController = ProxyController.create<OrderStatusController>(new OrderStatusController(OrderStatusRouteConfig.getInstance()));

OrderStatusRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , OrderStatusController.setEntity(OrderStatus));
OrderStatusRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('OrderStatus'));
OrderStatusRouter.get('/' , ctrl.home);
OrderStatusRouter.get('/entries' , ctrl.findAll);
OrderStatusRouter.get('/detail/:id' , ctrl.findOne);
OrderStatusRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
OrderStatusRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
OrderStatusRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
OrderStatusRouter.post('/delete/entries/many' , ctrl.deleteMany);
OrderStatusRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);