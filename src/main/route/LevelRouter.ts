import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { LevelController } from '../controller/LevelController';
import { LevelRouteConfig } from './config/LevelRouteConfig';
import { Level } from '../entity/Level';

export const LevelRouter : Router = express.Router();
const ctrl : LevelController = ProxyController.create<LevelController>(new LevelController(LevelRouteConfig.getInstance()));

LevelRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-one") , LevelController.setEntity(Level));
LevelRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('Level'));
LevelRouter.get('/' , ctrl.home);
LevelRouter.get('/entries' , ctrl.findAll);
LevelRouter.get('/detail/:id' , ctrl.findOne);
LevelRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
LevelRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
LevelRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
LevelRouter.post('/delete/entries/many' , ctrl.deleteMany);
LevelRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);