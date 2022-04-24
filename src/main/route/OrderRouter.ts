import express , { Router } from 'express';
import { BaseController } from '../controller/abstract/BaseController';
import { ProxyController } from '../util/proxy/ProxyController';
import { OrderController } from '../controller/OrderController';
import { OrderRouteConfig } from './config/OrderRouteConfig';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ValidationRegister } from '../helper/validation/register';
import { Order } from '../entity/Order';

export const OrderRouter : Router = express.Router();
const ctrl : OrderController = ProxyController.create<OrderController>(new OrderController(OrderRouteConfig.getInstance()));

OrderRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("order") , BaseController.setEntity(Order));
OrderRouter.get('/' , ctrl.home);
let manyEntriesRoutes : string[] = ['/entries' , '/incomplete'];
OrderRouter.get(manyEntriesRoutes , ctrl.findAll);
OrderRouter.get('/detail/:id' , ctrl.findOne);
OrderRouter.get('/requery-transaction/:reference' , ctrl.verifyOrder);
OrderRouter.get('/update/:id' , ctrl.updateOne);
OrderRouter.post('/update/:id' , ValidationRegister.setSchema('OrderUpdate') , ctrl.update);
OrderRouter.post('/delete/entries/many' , ctrl.deleteMany);
OrderRouter.get('/delete/entries/all' , ctrl.deleteAll);
OrderRouter.post('/delete/entries/all' , ctrl.findAndDeleteAll);