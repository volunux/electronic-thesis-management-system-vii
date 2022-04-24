import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { RoleController } from '../controller/RoleController';
import { RoleRouteConfig } from './config/RoleRouteConfig';
import { Role } from '../entity/Role';

export const RoleRouter : Router = express.Router();
const ctrl : RoleController = ProxyController.create<RoleController>(new RoleController(RoleRouteConfig.getInstance()));

RoleRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-one"));
RoleRouter.route(/^\/(.*)\/?$/i).post(RoleController.setEntity(Role) , ValidationRegister.setSchema('Role'));
RoleRouter.get('/' , ctrl.home);
RoleRouter.get('/entries' , ctrl.findAll);
RoleRouter.get('/detail/:id' , ctrl.findOne);
RoleRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
RoleRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
RoleRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
RoleRouter.post('/delete/entries/many' , ctrl.deleteMany);
RoleRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);