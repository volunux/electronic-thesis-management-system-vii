import express , { Router } from 'express';
import { LocalImageUploader } from '../helper/file/uploader/LocalImageUploader';
import { LocalFileValidator } from '../helper/file/validator/LocalFileValidator';
import { AdminController } from '../controller/AdminController';
import { ProxyController } from '../util/proxy/ProxyController';

export const AdminRouter : Router = express.Router();
const localImageUploader : LocalImageUploader = LocalImageUploader.getInstance();
const ctrl : AdminController = ProxyController.create<AdminController>(new AdminController(null));

AdminRouter.get('/' , ctrl.dashboard);
AdminRouter.get('/entries' , ctrl.entries);
AdminRouter.get('/others' , ctrl.others);
AdminRouter.get('/change-display-picture/' , ctrl.updateOneDisplay);
AdminRouter.post('/change-display-picture/' , localImageUploader.getUploader(200 , 1).single('display_picture') ,
localImageUploader.checkFileUpload('image') , LocalFileValidator.getInstance().mimetype('image' , 'images') , localImageUploader.validate('image' , 'images') , 
localImageUploader.checkFileSize('image' , 200 , 'images') , ctrl.updateDisplay);