import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { PublisherController } from '../controller/PublisherController';
import { PublisherRouteConfig } from './config/PublisherRouteConfig';
import { Publisher } from '../entity/Publisher';

export const PublisherRouter : Router = express.Router();
const ctrl : PublisherController = ProxyController.create<PublisherController>(new PublisherController(PublisherRouteConfig.getInstance()));

PublisherRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-two") , PublisherController.setEntity(Publisher));
PublisherRouter.route(/^\/(.*)\/?$/i).post(ValidationRegister.setSchema('Publisher'));
PublisherRouter.get('/' , ctrl.home);
PublisherRouter.get('/entries' , ctrl.findAll);
PublisherRouter.get('/detail/:id' , ctrl.findOne);
PublisherRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
PublisherRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
PublisherRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
PublisherRouter.post('/delete/entries/many' , ctrl.deleteMany);
PublisherRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);