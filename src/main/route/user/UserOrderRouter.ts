import express , { Router } from 'express';
import { BaseController } from '../../controller/abstract/BaseController';
import { ProxyController } from '../../util/proxy/ProxyController';
import { UserOrderController } from '../../controller/user/UserOrderController';
import { OrderRouteConfig } from '../config/OrderRouteConfig';
import { LayoutConfigurer } from '../../helper/view/LayoutConfigurer';
import { Order } from '../../entity/Order';

export const UserOrderRouter : Router = express.Router();

const ctrl : UserOrderController = ProxyController.create<UserOrderController>(new UserOrderController(OrderRouteConfig.getInstance()));

UserOrderRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("order") , BaseController.setEntity(Order));
UserOrderRouter.get('/' , ctrl.home);
let manyEntriesRoutes : string[] = ['/entries' , '/incomplete'];
UserOrderRouter.get(manyEntriesRoutes , ctrl.findAll);
UserOrderRouter.get('/detail/:id' , ctrl.findOne);
UserOrderRouter.get('/requery-transaction/:reference' , ctrl.verifyOrder);