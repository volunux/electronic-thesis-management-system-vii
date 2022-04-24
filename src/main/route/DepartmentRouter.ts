import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { DepartmentController } from '../controller/DepartmentController';
import { DepartmentRouteConfig } from './config/DepartmentRouteConfig';
import { Department } from '../entity/Department';

export const DepartmentRouter : Router = express.Router();
const ctrl : DepartmentController = ProxyController.create<DepartmentController>(new DepartmentController(DepartmentRouteConfig.getInstance()));

DepartmentRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-one") , DepartmentController.setEntity(Department));
DepartmentRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('Department') , DepartmentController.setDepartment(Department));
DepartmentRouter.get('/' , ctrl.home);
DepartmentRouter.get('/entries' , ctrl.findAll);
DepartmentRouter.get('/detail/:id' , ctrl.findOne);
DepartmentRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
DepartmentRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
DepartmentRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
DepartmentRouter.post('/delete/entries/many' , ctrl.deleteMany);
DepartmentRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);