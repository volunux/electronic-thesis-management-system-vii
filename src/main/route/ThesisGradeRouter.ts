import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { ThesisGradeController } from '../controller/ThesisGradeController';
import { ThesisGradeRouteConfig } from './config/ThesisGradeRouteConfig';
import { ThesisGrade } from '../entity/ThesisGrade';

export const ThesisGradeRouter : Router = express.Router();
const ctrl : ThesisGradeController = ProxyController.create<ThesisGradeController>(new ThesisGradeController(ThesisGradeRouteConfig.getInstance()));

ThesisGradeRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , ThesisGradeController.setEntity(ThesisGrade));
ThesisGradeRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('ThesisGrade'));
ThesisGradeRouter.get('/' , ctrl.home);
ThesisGradeRouter.get('/entries' , ctrl.findAll);
ThesisGradeRouter.get('/detail/:id' , ctrl.findOne);
ThesisGradeRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
ThesisGradeRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
ThesisGradeRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
ThesisGradeRouter.post('/delete/entries/many' , ctrl.deleteMany);
ThesisGradeRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);