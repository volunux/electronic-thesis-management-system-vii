import { Request, Response, RequestHandler, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { BaseEntityController } from './abstract/BaseEntityController';
import { UserHelper } from '../helper/entry/UserHelper';
import { Faculty } from '../entity/Faculty';
import { Department } from '../entity/Department';
import { Level } from '../entity/Level';
import { Country } from '../entity/Country';
import { Role } from '../entity/Role';
import { UserStatus } from '../entity/UserStatus';
import { UserServiceImpl } from '../model/service/impl/UserServiceImpl';
import { UserService } from '../model/service/UserService';
import { FacultyService } from '../model/service/FacultyService';
import { FacultyServiceImpl } from '../model/service/impl/FacultyServiceImpl';
import { DepartmentService } from '../model/service/DepartmentService';
import { DepartmentServiceImpl } from '../model/service/impl/DepartmentServiceImpl';
import { LevelService } from '../model/service/LevelService';
import { LevelServiceImpl } from '../model/service/impl/LevelServiceImpl';
import { CountryService } from '../model/service/CountryService';
import { CountryServiceImpl } from '../model/service/impl/CountryServiceImpl';
import { UserStatusService } from '../model/service/UserStatusService';
import { UserStatusServiceImpl } from '../model/service/impl/UserStatusServiceImpl';
import { RoleService } from '../model/service/RoleService';
import { RoleServiceImpl } from '../model/service/impl/RoleServiceImpl';
import { User } from '../entity/User';
import { VxEntity } from '../entity/abstract/VxEntity';
import { Newable } from '../entity/interface/Newable';
import { MailMessage } from '../util/mail/MailMessage';
import { MailMessageImpl } from '../util/mail/MailMessageImpl';
import { MailSender } from '../util/mail/MailSender';
import { MailSenderServicesContainer } from '../util/mail/MailSenderServicesContainer';
import { MailHelper } from '../helper/middleware/MailHelper';

export class UserController extends BaseEntityController<User> {

  protected service: UserService = new UserServiceImpl();
  protected VxEntity: Newable<User> = User;
  private facultyService: FacultyService = new FacultyServiceImpl();
  private departmentService: DepartmentService = new DepartmentServiceImpl();
  private levelService: LevelService = new LevelServiceImpl();
  private userStatusService: UserStatusService = new UserStatusServiceImpl();
  private countryService: CountryService = new CountryServiceImpl();
  private roleService: RoleService = new RoleServiceImpl();
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');

  constructor(config: RouteOptionsConfig, VxEntity: Newable<User>) { super(config, VxEntity); }

  public static setEntity(VxEntity: Newable<VxEntity | User>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) { req.bindingModel = new VxEntity(req.body); }
      else { req.bindingModel = new VxEntity({}); }

      return next();
    }
  }

  public static setUser(VxEntity: Newable<User>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);
        let faculty: Faculty = new Faculty({});
        faculty.setId(req.body.faculty);
        (<User>req.bindingModel).setFaculty(faculty);

        let department: Department = new Department({});
        department.setId(req.body.department);
        (<User>req.bindingModel).setDepartment(department);

        let country: Country = new Country({});
        country.setId(req.body.country);
        (<User>req.bindingModel).setCountry(country);

        let level: Level = new Level({});
        level.setId(req.body.level);
        (<User>req.bindingModel).setLevel(level);

        let status: UserStatus = new UserStatus({});
        status.setId(req.body.status);
        (<User>req.bindingModel).setStatus(req.body.status ? status : <any>undefined);
      }
      else { req.bindingModel = new VxEntity({}); }

      return next();
    }
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {

    let id: string = req.params.id;
    let entry: User | null = await this.service.findOne(id);
    let statuses: UserStatus[] = [];

    if (entry !== null) {
      statuses = await this.userStatusService.selectOnlyNameAndId();
      if (statuses.length < 1) { throw new Error("An error has occured."); }
    }
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'statuses': statuses });
  }

  public async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let status: string = req.body.status;
    let entryExists: boolean = await this.service.existsOne(id);

    if (entryExists === false) { throw new Error("An error has occured."); }
    if (req.validationErrors.isEmpty() === false) {
      let statuses: UserStatus[] = await this.userStatusService.selectOnlyNameAndId();
      let entry: User | null = await this.service.findOne(id);

      if (entry !== null) { if (statuses.length < 1) { throw new Error("An error has occured."); } }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'statuses': statuses });
      return;
    }

    let entryUpdated: boolean = await this.service.updateStatus(+id, status);
    if (entryUpdated === false) { throw new Error("An error has occured."); }

    req.flash('success', 'Entry successfully updated.');
    let emailAddress: string = req.body.user_email_address;
    let fullName: string = req.body.user_full_name;
    let user = new User({});
    user.setEmailAddress(emailAddress);

    if (user !== null) {
      let datas: { [key: string]: any } = { 'host': (<IncomingHttpHeaders>req.headers).host as string, 'full_name': fullName };
      let mailMessage: MailMessage = new MailMessageImpl('User Profile Status', "");
      MailHelper.renderTemplateAndSend(res, 'templates/user-status', this.mailSender, mailMessage, <any>user, datas);
    }

    return res.redirect(this.backToEntries());
  }

  public async addOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user: User | null = await this.service.addOne();
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];
    let statuses: UserStatus[] = [];

    if (user !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      levels = await this.levelService.selectOnlyNameAndId();
      countries = await this.countryService.selectOnlyNameAndId();
      statuses = await this.userStatusService.selectOnlyNameAndId();
    }
    res.render(this.getBaseViewPath() + 'entry-create', { 'entry': user, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries, 'statuses': statuses });
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: User | null = <User>req.bindingModel;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];
    let statuses: UserStatus[] = [];

    if (req.validationErrors.isEmpty() === false) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      levels = await this.levelService.selectOnlyNameAndId();
      countries = await this.countryService.selectOnlyNameAndId();
      statuses = await this.userStatusService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();

      res.render(this.getBaseViewPath() + 'entry-create', { 'entry': entry, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries, 'statuses': statuses });
      return;
    }

    let newUser = await this.service.save(<User>entry);

    if (newUser !== null) {
      let datas: { [key: string]: any } = {
        'email_address': entry.getEmailAddress(),
        'password': entry.getPassword()
      };
      let mailMessage: MailMessage = new MailMessageImpl('Account Created Successfully', "");
      MailHelper.renderTemplateAndSend(res, 'templates/welcome', this.mailSender, mailMessage, <any>entry, datas);
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to save entry."); }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: User | null = await this.service.updateOne(id);
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];
    let statuses: UserStatus[] = [];
    if (entry !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      levels = await this.levelService.selectOnlyNameAndId();
      countries = await this.countryService.selectOnlyNameAndId();
      statuses = await this.userStatusService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();
    }

    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries, 'statuses': statuses });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {

    let id: string = req.params.id;
    let entry: User | null = <User>req.bindingModel;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];
    let statuses: UserStatus[] = [];

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) {
        faculties = await this.facultyService.selectOnlyNameAndId();
        if (faculties.length < 1) { throw new Error("An error has occured."); }
        levels = await this.levelService.selectOnlyNameAndId();
        countries = await this.countryService.selectOnlyNameAndId();
        statuses = await this.userStatusService.selectOnlyNameAndId();
        departments = await this.departmentService.selectOnlyNameAndId();
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + 'entry-update', { 'entry': entry, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries, 'statuses': statuses });
      return;
    }

    entry = await this.service.update(id, <User>entry);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  public async updateOneRole(req: Request, res: Response, next: NextFunction): Promise<void> {

    let id: string = req.params.id;
    let entry: User | null = await this.service.updateOneRole(+id);
    let roles: Role[] = [];

    if (entry !== null) {
      roles = await this.roleService.selectOnlyNameAndId();
      if (roles.length < 1) { throw new Error("An error has occured."); }
    }

    res.render(this.getBaseViewPath() + 'entry-update-role', { 'entry': entry, 'roles': roles, 'toDelete': true });
  }

  public async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {

    let id: string = req.params.id;
    let entry: User | null = <User>req.bindingModel;
    let roles: Role[] = [];

    if (req.validationErrors.isEmpty() === false) {
      roles = await this.roleService.selectOnlyNameAndId();
      if (roles.length < 1) { throw new Error("An error has occured."); }

      res.render(this.getBaseViewPath() + "entry-update-role", { 'entry': entry, 'roles': roles, 'toDelete': true });
      return;
    }

    if (!(await this.service.existsOne(id))) { throw new Error("An error has occured."); }

    let roleUpdated: boolean = await this.service.updateAndDeleteRole(+id, <User>entry);
    if (roleUpdated === false) { throw new Error("Failed to save entry."); }
    if (entry !== null) {
      let roles: string = UserHelper.jsonArrayFlattener(await (<any>this.roleService.findUserRoles(+id)), 'name').join(' , ');
      let datas: { [key: string]: any } = {
        'full_name': entry.getFirstName() + ' ' + entry.getLastName(),
        'roles': roles,
        'email_address': entry.getEmailAddress()
      };

      let mailMessage: MailMessage = new MailMessageImpl('User Role Update', "");
      MailHelper.renderTemplateAndSend(res, 'templates/role-update', this.mailSender, mailMessage, <any>entry, datas);
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to save entry."); }
  }

  protected getBaseViewPath(): string { return "pages/distinct/user/"; }

  protected backToEntries(): string { return "/internal/user/entries/"; }

  protected backToHome(): string { return "/internal/user/"; }

}