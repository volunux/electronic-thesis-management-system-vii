import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { UserProfile } from '../helper/middleware/UserProfile';
import { UserController } from '../controller/UserController';
import { UserRouteConfig } from './config/UserRouteConfig';
import { User } from '../entity/User';

export const UserRouter : Router = express.Router();

const ctrl : UserController = ProxyController.create<UserController>(new UserController(UserRouteConfig.getInstance() , User));

UserRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("user") , UserController.setEntity(User));
UserRouter.get('/' , ctrl.home);
UserRouter.get('/entries' , ctrl.findAll);
UserRouter.route('/detail/:id').get(ctrl.findOne).post(ValidationRegister.setSchema('UserDetail') , ctrl.updateStatus);
UserRouter.route('/add').get(ctrl.addOne).post(ValidationRegister.setSchema('UserCreate') , UserProfile.verifyDepartmentAndFaculty , UserProfile.checkUsernameAndEmail , UserProfile.checkMatricNumber , ctrl.save);
UserRouter.route('/update/:id').get(ctrl.updateOne).post(ValidationRegister.setSchema('UserUpdate') , UserProfile.verifyDepartmentAndFaculty , ctrl.update);
UserRouter.route('/role/update/:id').get(ctrl.updateOneRole).post(ValidationRegister.setSchema('UserRoleUpdate') , ctrl.updateRole);
UserRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
UserRouter.post('/delete/entries/many' , ctrl.deleteMany);
UserRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);