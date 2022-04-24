import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { FacultyController } from '../controller/FacultyController';
import { FacultyRouteConfig } from './config/FacultyRouteConfig';
import { Faculty } from '../entity/Faculty';

export const FacultyRouter : Router = express.Router();
const ctrl : FacultyController = ProxyController.create<FacultyController>(new FacultyController(FacultyRouteConfig.getInstance()));

FacultyRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-one") , FacultyController.setEntity(Faculty));
FacultyRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('Faculty'));
FacultyRouter.get('/' , ctrl.home);
FacultyRouter.get('/entries' , ctrl.findAll);
FacultyRouter.get('/detail/:id' , ctrl.findOne);
FacultyRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
FacultyRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
FacultyRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
FacultyRouter.post('/delete/entries/many' , ctrl.deleteMany);
FacultyRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);