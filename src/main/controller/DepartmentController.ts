import { Request, Response, RequestHandler, NextFunction } from 'express';
import { BaseEntityController } from './abstract/BaseEntityController';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { GeneralFilter } from '../helper/filter/GeneralFilter';
import { Newable } from '../entity/interface/Newable';
import { DepartmentServiceImpl } from '../model/service/impl/DepartmentServiceImpl';
import { DepartmentService } from '../model/service/DepartmentService';
import { FacultyService } from '../model/service/FacultyService';
import { FacultyServiceImpl } from '../model/service/impl/FacultyServiceImpl';
import { Department } from '../entity/Department';
import { Faculty } from '../entity/Faculty';
import { VxEntity } from '../entity/abstract/VxEntity';
import { UserSession } from '../entity/UserSession';

export class DepartmentController extends BaseEntityController<Department> {

  protected service: DepartmentService = new DepartmentServiceImpl();
  protected VxEntity: Newable<Department> = Department;
  private facultyService: FacultyService = new FacultyServiceImpl();

  constructor(config: RouteOptionsConfig) { super(config, Department); }

  public static setDepartment(VxEntity: Newable<VxEntity>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);
        if (req.user !== null && req.user !== undefined) { (<VxEntity>req.bindingModel).setUserId((<UserSession>req.user).getId()); }
      }
      else { req.bindingModel = new VxEntity({}); }
      return next();
    }
  }

  public async rFindDepartmentInFaculty(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entries: Department[] = await this.service.findDepartmentInFaculty(+id);
    entries = GeneralFilter.arrayOfCusObjectFieldFilter(['name', '_id'], entries);
    res.status(200).json(entries);
  }

  public async addOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let department: Department | null = await this.service.addOne();
    let faculties: Faculty[] = [];

    if (department !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
    }
    res.render(this.getBaseViewPath() + "entry-create", { 'faculties': faculties });
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    let department: Department | null = <Department>req.bindingModel;

    if (req.validationErrors.isEmpty() === false) {
      let faculties: Faculty[] = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      res.render(this.getBaseViewPath() + "entry-create", { 'entry': department, 'faculties': faculties });
      return;
    }

    department = await this.service.save(<Department>department);

    if (department !== null) {
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Department | null = await this.service.updateOne(id);
    let faculties: Faculty[] = [];
    if (entry !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
    }
    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'faculties': faculties });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Department | null = <Department>req.bindingModel;
    let faculties: Faculty[] = [];

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) {
        faculties = await this.facultyService.selectOnlyNameAndId();
        if (faculties.length < 1) { throw new Error("An error has occured."); }
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'faculties': faculties });
      return;
    }
    entry = await this.service.update(id, <Department>entry);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  protected getBaseViewPath(): string { return "pages/distinct/department/"; }

  protected backToEntries(): string { return "/internal/department/entries/"; }

  protected backToHome(): string { return "/internal/department/"; }

}