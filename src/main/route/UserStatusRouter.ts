import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { UserStatusController } from '../controller/UserStatusController';
import { UserStatusRouteConfig } from './config/UserStatusRouteConfig';
import { UserStatus } from '../entity/UserStatus';

export const UserStatusRouter : Router = express.Router();
const ctrl : UserStatusController = ProxyController.create<UserStatusController>(new UserStatusController(UserStatusRouteConfig.getInstance()));

UserStatusRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , UserStatusController.setEntity(UserStatus));
UserStatusRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('UserStatus'));
UserStatusRouter.get('/' , ctrl.home);
UserStatusRouter.get('/entries' , ctrl.findAll);
UserStatusRouter.get('/detail/:id' , ctrl.findOne);
UserStatusRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
UserStatusRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
UserStatusRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
UserStatusRouter.post('/delete/entries/many' , ctrl.deleteMany);
UserStatusRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);