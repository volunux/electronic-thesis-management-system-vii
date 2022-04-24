import express , { Router } from 'express';
import { GeneralMiddleware } from '../helper/middleware/GeneralMiddleware';
import { ProxyController } from '../util/proxy/ProxyController';
import { FacultyController } from '../controller/FacultyController';
import { RouteOptionsConfig } from './config/RouteOptionsConfig';
import { DepartmentController } from '../controller/DepartmentController';

export const RestRouter : Router = express.Router();

const ctrlft : FacultyController = ProxyController.create<FacultyController>(new FacultyController(RouteOptionsConfig.empty()));
const ctrldt : DepartmentController = ProxyController.create<DepartmentController>(new DepartmentController(RouteOptionsConfig.empty()));

RestRouter.use(GeneralMiddleware.jsonMiddleWare);
RestRouter.get('/faculty/entries' , ctrlft.rselectNameAndId);
RestRouter.get('/department/faculty/entries/:id' , ctrldt.rFindDepartmentInFaculty);