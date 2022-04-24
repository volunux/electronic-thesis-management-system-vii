import { Request, Response, NextFunction, RequestHandler } from 'express';
import { BaseController } from './abstract/BaseController';
import { FileUploadSpec } from '../entity/interface/FileUploadSpec';
import { UserHelper } from '../helper/entry/UserHelper';
import { UserSession } from '../entity/UserSession';
import { Attachment } from '../entity/Attachment';
import { ProfileService } from '../model/service/ProfileService';
import { ProfileServiceImpl } from '../model/service/impl/ProfileServiceImpl';
import { CountryService } from '../model/service/CountryService';
import { CountryServiceImpl } from '../model/service/impl/CountryServiceImpl';
import { FacultyService } from '../model/service/FacultyService';
import { FacultyServiceImpl } from '../model/service/impl/FacultyServiceImpl';
import { DepartmentService } from '../model/service/DepartmentService';
import { DepartmentServiceImpl } from '../model/service/impl/DepartmentServiceImpl';
import { LevelService } from '../model/service/LevelService';
import { LevelServiceImpl } from '../model/service/impl/LevelServiceImpl';
import { AuthenticationService } from '../model/service/AuthenticationService';
import { AuthenticationServiceImpl } from '../model/service/impl/AuthenticationServiceImpl';
import { Newable } from '../entity/interface/Newable';
import { VxEntity } from '../entity/abstract/VxEntity';
import { Faculty } from '../entity/Faculty';
import { Department } from '../entity/Department';
import { Level } from '../entity/Level';
import { Country } from '../entity/Country';
import { User } from '../entity/User';
import { UserDto } from '../entity/dto/UserDto';

export class ProfileController extends BaseController {

  private service: ProfileService = new ProfileServiceImpl();
  private countryService: CountryService = new CountryServiceImpl();
  private facultyService: FacultyService = new FacultyServiceImpl();
  private departmentService: DepartmentService = new DepartmentServiceImpl();
  private levelService: LevelService = new LevelServiceImpl();
  private authService: AuthenticationService = new AuthenticationServiceImpl();
  private profilePhotoFileSpec: FileUploadSpec = { 'fileSize': 153600, 'uploadUrl': '/profile/profile-photo/', 'fileType': 'image', 'fieldName': 'profile_photo', 'label': 'Profile Photo', 'accept': 'image/*', 'file_upl': true };
  private signatureFileSpec: FileUploadSpec = { 'fileSize': 153600, 'uploadUrl': '/profile/signature/', 'fileType': 'image', 'fieldName': 'profile_signature', 'label': 'Signature', 'accept': 'image/*', 'file_upl': true };

  public static setEntity(VxEntity: Newable<VxEntity | User | UserDto>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);
        let id: string = req.params.id;
        if (id) (<VxEntity>req.bindingModel).setId(+id);
        if (req.user !== null && req.user !== undefined) { (<VxEntity>req.bindingModel).setId((<UserSession>req.user).getId()); }
      }
      else { req.bindingModel = new VxEntity({}); }

      return next();
    }
  }

  public static setUserObject(VxEntity: Newable<Attachment>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.file !== null && req.file !== undefined) {
        req.multipartFile = new VxEntity(req.file);
        if (req.user !== null && req.user !== undefined) {
          let userId: number = (<UserSession>req.user).getId(), user: User = new User({});
          (<VxEntity>req.multipartFile).setUserId(userId);
          user.setId(userId);
          (<VxEntity>req.multipartFile).setUser(user);
        }
      }
      else { req.multipartFile = new VxEntity({}); }

      return next();
    }
  }

  public static setUserObjectII(VxEntity: Newable<Attachment>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);
        if (req.user !== null && req.user !== undefined) {
          let userId: number = (<UserSession>req.user).getId();
          let user: User = new User({});
          (<VxEntity>req.bindingModel).setUserId(userId);
          user.setId(userId);
          (<VxEntity>req.bindingModel).setUser(user);
        }
      }
      else { req.bindingModel = new VxEntity({}); }

      return next();
    }
  }

  public async home(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "dashboard"); }

  public async entries(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "user-entries"); }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entry: User | null = await this.service.findOne(id);
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry });
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entry: User | null = await this.service.updateOne(id + "");
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];

    if (entry !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      levels = await this.levelService.selectOnlyNameAndId();
      countries = await this.countryService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();
    }

    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entry: User | null = <User>req.bindingModel;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let levels: Level[] = [];
    let countries: Country[] = [];
    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id + "")) {
        faculties = await this.facultyService.selectOnlyNameAndId();
        if (faculties.length < 1) { throw new Error("An error has occured."); }
        levels = await this.levelService.selectOnlyNameAndId();
        countries = await this.countryService.selectOnlyNameAndId();
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'departments': departments, 'faculties': faculties, 'levels': levels, 'countries': countries });
      return;
    }

    entry = await this.service.update(id + "", <User>entry);
    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect('/profile');
    }
    else { throw new Error("Failed to update entry."); }
  }

  public async changeOnePassord(req: Request, res: Response, next: NextFunction): Promise<void> {
    let resetPasswordToken: string = req.params.token;
    let userId: number = (<UserSession>req.user).getId();
    res.render("pages/distinct/authentication/password-change");
  }

  public async changePassord(req: Request, res: Response, next: NextFunction): Promise<void> {
    let resetPasswordToken: string = req.params.token;
    let id: number = (<UserSession>req.user).getId();
    let user: User | null = await this.authService.existsLoginDetailsById(id);
    let entry: any = req.bindingModel;
    if (req.validationErrors.isEmpty() === false) { return res.render("pages/distinct/authentication/password-change"); }
    let currentPassword: string = req.body.current_password;

    if (UserHelper.validPassword(currentPassword, <User>user) === false) {
      req.validationErrors.addError("Current password is not correct.");
      return res.render("pages/distinct/authentication/password-change");
    }

    (<User>user).setPassword(entry.password);
    UserHelper.setPassword(<User>user);
    user = await this.authService.saveNewPassword(<User>user);
    req.flash('success', 'Password changed successfully.');
    return res.redirect('/profile');
  }

  public async deactivateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId(), status: string = 'Active';
    let entry: User | null = await this.service.updateOneStatus(id);
    if (entry !== null) status = entry.getStatus().getName();
    res.render(this.getBaseViewPath() + "entry-deactivate", { 'entry': entry, 'status': status });
  }

  public async reactivateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId(), status: string = 'Deactivated';
    let entry: User | null = await this.service.updateOneStatus(id);
    if (entry !== null) status = entry.getStatus().getName();
    res.render(this.getBaseViewPath() + "entry-reactivate", { 'entry': entry, 'status': status });
  }

  public async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entry: User | null = await this.service.updateStatus(id, 'Deactivated');
    if (entry !== null) {
      req.flash('success', 'Profile successfully deactivated.');
      res.redirect('/profile/');
    }
    else { throw new Error("Entry cannot be found or retrieved"); }
  }

  public async reactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entry: User | null = await this.service.updateStatus(id, 'Active');
    if (entry !== null) {
      req.flash('success', 'Profile successfully reactivated.');
      res.redirect('/profile/');
    }
    else { throw new Error("Entry cannot be found or retrieved"); }
  }

  public addObject(VxEntity: Newable<Attachment>, entityName: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let fileSpecs: FileUploadSpec | null = null;

      switch (entityName) {
        case "UserProfilePhoto":
          fileSpecs = context.profilePhotoFileSpec;
          break;

        case "UserSignature":
          fileSpecs = context.signatureFileSpec;
          break;

        default:
      }

      let id: number = (<UserSession>req.user).getId();
      let entryExists: boolean = await context.service.existsOne(id + "");
      if (entryExists === false) throw new Error("An Error has occured");
      return res.render(context.getBaseViewPath() + "entry-update-object", { ...fileSpecs });
    }
  }

  public saveObject(VxEntity: Newable<Attachment>, entityName: string, bucketName: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let fileSpecs: FileUploadSpec | null = null;
      let entry: Attachment | null = <Attachment>req.multipartFile;

      switch (entityName) {
        case "UserProfilePhoto":
          fileSpecs = context.profilePhotoFileSpec;
          break;

        case "UserSignature":
          fileSpecs = context.signatureFileSpec;
          break;

        default:
      }

      await context.saveUserObject(req, res, next, "entry-update-object", entityName, entry, bucketName, fileSpecs as any);
    }
  }

  protected async saveUserObject(req: Request, res: Response, next: NextFunction, viewName: string, entityName: string, entry: Attachment | null, bucketName: string, fileSpec: FileUploadSpec): Promise<void> {
    let id: number = (<UserSession>req.user).getId();
    let entryExists: boolean = await this.service.existsOne(id + "");
    if (entryExists === false) throw new Error("An Error has occured");

    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + viewName, { ...fileSpec });
      return;
    }

    entry = await this.service.updateUserObject(id, entityName, entry, bucketName);
    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect('/profile/');
    }
    else { throw new Error("Failed to save entry"); }
  }

  public deleteUserObject(VxEntity: Newable<Attachment>, entityName: string, bucketName: string, label: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let id: number = (<UserSession>req.user).getId();
      await context.service.deleteUserObject(id, entityName, bucketName);
      req.flash('success', `${label} successfully deleted.`);
      res.redirect('/profile/');
    }
  }

  public deleteOneObject(VxEntity: Newable<Attachment>, label: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      res.render(context.getBaseViewPath() + "entry-delete-object", { 'objectType': label });
    }
  }

  public saveUserObjectII(VxEntity: Newable<Attachment>, entityName: string, bucketName: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let id: number = (<UserSession>req.user).getId();
      let entry: Attachment | null = <Attachment>req.bindingModel;
      if (req.validationErrors.isEmpty() === false) {
        let errors: string[] | null = req.validationErrors.getErrors();
        res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': errors } });
        return;
      }

      entry = await context.service.updateUserObject(id, entityName, entry, bucketName);
      if (entry !== null) { res.status(200).json({ 'message': 'Action successful', 'details': { 'redirectUrl': '/profile' } }); }
      else { res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': [] } }); }
    }
  }

  public deleteUserObjectII(VxEntity: Newable<Attachment>, entityName: string, bucketName: string): RequestHandler {
    let context: ProfileController = this;
    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let objectKey: string = req.params.objectkey;
      let entry: Attachment | null = await context.service.deleteUserObjectByKey(objectKey, entityName, bucketName);
      if (entry !== null) { res.status(200).json({ 'message': 'Action successful' }); }
      else { res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': [] } }); }
    }
  }

  protected getBaseViewPath(): string { return "pages/distinct/profile/"; }

}