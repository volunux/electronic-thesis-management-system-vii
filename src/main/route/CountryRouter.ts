import express , { Router } from 'express';
import { LayoutConfigurer } from '../helper/view/LayoutConfigurer';
import { ProxyController } from '../util/proxy/ProxyController';
import { ValidationRegister } from '../helper/validation/register';
import { CountryController } from '../controller/CountryController';
import { CountryRouteConfig } from './config/CountryRouteConfig';
import { Country } from '../entity/Country';

export const CountryRouter : Router = express.Router();
const ctrl : CountryController = ProxyController.create<CountryController>(new CountryController(CountryRouteConfig.getInstance()));

CountryRouter.use(/^\/(.*)\/?$/i , ctrl.setEntityAttr , LayoutConfigurer.setLayout("internal-one"));
CountryRouter.route(/^\/(.*)\/?$/i).post(CountryController.setEntity(Country) , ValidationRegister.setSchema('Country'));
CountryRouter.get('/' , ctrl.home);
CountryRouter.get('/entries' , ctrl.findAll);
CountryRouter.get('/detail/:id' , ctrl.findOne);
CountryRouter.route('/add').get(ctrl.addOne).post(ctrl.save);
CountryRouter.route('/update/:id').get(ctrl.updateOne).post(ctrl.update);
CountryRouter.route('/delete/:id').get(ctrl.deleteOne).post(ctrl.delete);
CountryRouter.post('/delete/entries/many' , ctrl.deleteMany);
CountryRouter.route('/delete/entries/all').get(ctrl.deleteAll).post(ctrl.findAndDeleteAll);