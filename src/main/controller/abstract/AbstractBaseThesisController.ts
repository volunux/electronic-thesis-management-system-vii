import { Request, Response, RequestHandler, NextFunction } from 'express';
import ConfigurationProperties from '../../config/ConfigurationProperties';
import FileConfigurerImpl from '../../util/aws/s3/FileConfigurerImpl';
import S3SignedUrlGenerator from '../../helper/file/S3SignedUrlGenerator';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { BaseEntityController } from './BaseEntityController';
import { VxEntity } from '../../entity/abstract/VxEntity';
import { ThesisAttachment } from '../../entity/ThesisAttachment';
import { Faculty } from '../../entity/Faculty';
import { Department } from '../../entity/Department';
import { Publisher } from '../../entity/Publisher';
import { User } from '../../entity/User';
import { UserSession } from '../../entity/UserSession';
import { BaseThesisService } from '../../model/service/abstract/BaseThesisService';
import { FacultyService } from '../../model/service/FacultyService';
import { FacultyServiceImpl } from '../../model/service/impl/FacultyServiceImpl';
import { DepartmentService } from '../../model/service/DepartmentService';
import { DepartmentServiceImpl } from '../../model/service/impl/DepartmentServiceImpl';
import { ThesisGradeService } from '../../model/service/ThesisGradeService';
import { ThesisGradeServiceImpl } from '../../model/service/impl/ThesisGradeServiceImpl';
import { PublisherService } from '../../model/service/PublisherService';
import { PublisherServiceImpl } from '../../model/service/impl/PublisherServiceImpl';
import { ThesisStatusService } from '../../model/service/ThesisStatusService';
import { ThesisStatusServiceImpl } from '../../model/service/impl/ThesisStatusServiceImpl';
import { Thesis } from '../../entity/Thesis';
import { Newable } from '../../entity/interface/Newable';
import { FileUploadSpec } from '../../entity/interface/FileUploadSpec';
import { ThesisGrade } from '../../entity/ThesisGrade';
import { ThesisStatus } from '../../entity/ThesisStatus';
import { ThesisCoverImage } from '../../entity/ThesisCoverImage';
import { ThesisDocument } from '../../entity/ThesisDocument';
import { EntityNotFoundException } from '../../entity/error/EntityNotFoundException';

export abstract class AbstractBaseThesisController extends BaseEntityController<Thesis> {

  private eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  protected abstract service: BaseThesisService;
  protected VxEntity: Newable<Thesis> = Thesis;
  protected facultyService: FacultyService = new FacultyServiceImpl();
  protected departmentService: DepartmentService = new DepartmentServiceImpl();
  protected publisherService: PublisherService = new PublisherServiceImpl();
  protected thesisGradeService: ThesisGradeService = new ThesisGradeServiceImpl();
  protected thesisStatusService: ThesisStatusService = new ThesisStatusServiceImpl();
  protected thesisDocumentFileSpec: FileUploadSpec = { 'fileSize': 204800, 'uploadUrl': '/thesis/user/document/', 'fileType': 'application', 'label': 'Thesis Document', 'accept': 'application/*', 'fieldName': 'thesis_document', 'file_upl': true };
  protected thesisCoverImageFileSpec: FileUploadSpec = { 'fileSize': 1048576, 'uploadUrl': '/thesis/user/cover-image/', 'fileType': 'image', 'label': 'Thesis Cover Image', 'accept': 'image/*', 'fieldName': 'thesis_cover_image', 'file_upl': true };

  constructor(config: RouteOptionsConfig) { super(config, Thesis); }

  public static setThesis(VxEntity: Newable<VxEntity>): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (req.body !== null && req.body !== undefined) {
        req.bindingModel = new VxEntity(req.body);

        let faculty: Faculty = new Faculty({});
        faculty.setId(req.body.faculty);
        (<Thesis>req.bindingModel).setFaculty(faculty);

        let department: Department = new Department({});
        department.setId(req.body.department);
        (<Thesis>req.bindingModel).setDepartment(department);

        let thesisGrade: ThesisGrade = new ThesisGrade({});
        thesisGrade.setId(req.body.grade);
        (<Thesis>req.bindingModel).setGrade(thesisGrade);

        let publisher: Publisher = new Publisher({});
        publisher.setId(req.body.publisher);
        (<Thesis>req.bindingModel).setPublisher(publisher);

        let status: ThesisStatus = new ThesisStatus({});
        status.setId(req.body.status);
        (<Thesis>req.bindingModel).setStatus(req.body.status ? status : <any>undefined);

        if (req.user !== null && req.user !== undefined) {
          (<VxEntity>req.bindingModel).setUserId((<UserSession>req.user).getId());
          let user: User = new User({});
          user.setId((<UserSession>req.user).getId());
          (<Thesis>req.bindingModel).setUser(user);
        }
      }
      else { req.bindingModel = new VxEntity({}); }

      return next();
    }
  }

  public static setThesisCoverImage(req: Request, res: Response, next: NextFunction): void {
    if (req.file !== null && req.file !== undefined) {
      req.multipartFile = new ThesisCoverImage(req.file);
      if (req.user !== null && req.user !== undefined) (<ThesisCoverImage>req.multipartFile).setUserId((<UserSession>req.user).getId());
      let thesis: Thesis = new Thesis({});
      thesis.setId(req.body.thesis_id);
      (<ThesisCoverImage>req.multipartFile).setThesis(thesis);
    }
    else { req.bindingModel = new ThesisCoverImage({}); }

    return next();
  }

  public static setThesisDocument(req: Request, res: Response, next: NextFunction): void {
    if (req.file !== null && req.file !== undefined) {
      req.multipartFile = new ThesisDocument(req.file);
      if (req.user !== null && req.user !== undefined) (<ThesisDocument>req.multipartFile).setUserId((<UserSession>req.user).getId());
      let thesis: Thesis = new Thesis({});
      thesis.setId(req.body.thesis_id);
      (<ThesisDocument>req.multipartFile).setThesis(thesis);
    }
    else { req.bindingModel = new ThesisDocument({}); }

    return next();
  }

  public static setThesisCoverImageII(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new ThesisCoverImage(req.body);
      if (req.user !== null && req.user !== undefined) (<ThesisCoverImage>req.bindingModel).setUserId((<UserSession>req.user).getId());
    }
    else { req.bindingModel = new ThesisCoverImage({}); }

    return next();
  }

  public static setThesisDocumentII(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new ThesisDocument(req.body);
      if (req.user !== null && req.user !== undefined) (<ThesisDocument>req.bindingModel).setUserId((<UserSession>req.user).getId());
    }
    else { req.bindingModel = new ThesisDocument({}); }

    return next();
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Thesis | null = await this.service.findOne(id);
    let statuses: ThesisStatus[] = [];

    if (entry !== null) {
      statuses = await this.thesisStatusService.selectOnlyNameAndId();
      let emailAddress = this.eProps.getEmailAddress();
      let firstName: string = this.eProps.getFirstName();
      let lastName: string = this.eProps.getLastName();

      if (entry.getUser()) {
        if (!(entry.getUser().getFirstName())) entry.getUser().setFirstName(firstName);
        if (!(entry.getUser().getLastName())) entry.getUser().setLastName(lastName);
        if (!(entry.getUser().getEmailAddress())) entry.getUser().setEmailAddress(emailAddress);
      }
      else { entry.setUser(new User({ 'email_address': emailAddress, 'first_name': firstName, 'last_name': lastName })); }

      if (statuses.length < 1) { throw new Error("An error has occured."); }
    }

    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'statuses': statuses });
  }

  public async entryDownload(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userId: number = (<UserSession>req.user).getId();
    let thesisId: number = Number.parseInt(req.params.thesis);
    let fileConfigurer: FileConfigurerImpl = FileConfigurerImpl.getInstance();
    let entry: Thesis | null = await this.service.entryDownload(thesisId, userId);

    if (entry === null) {
      res.status(403).json({ 'message': 'Forbidden' });
      return;
    }

    let thesisDocBucketName: string = this.eProps.getThesisDocBucket();
    let url: string | null = S3SignedUrlGenerator.getInstance(fileConfigurer.getS3Instance(), fileConfigurer.getConfiguration()).createSignedUrlGet(entry.getDocument().getKey(), thesisDocBucketName);
    res.status(200).json({ 'url': url }) as any;
  }

  public async addOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let thesis: Thesis | null = await this.service.addOne();
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];

    if (thesis !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
      publishers = await this.publisherService.selectOnlyNameAndId();
    }

    res.render(this.getBaseViewPath() + "entry-create", { 'entry': thesis, 'title': this.title + ' Entry Add', 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers });
  }

  public async categoricalUpdate(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = await this.service.entryExists(id, userId);
    let title: string = this.title;

    if (entry !== null) { title = entry.getTitle(); }
    res.render(this.getBaseViewPath() + "category-update", { 'entry': entry, 'title': title });
  }

  public updateOneThesisObject(VxEntity: Newable<ThesisAttachment>, entityName: string): RequestHandler {
    let context: AbstractBaseThesisController = this;
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      let fileSpecs: FileUploadSpec | null = null;

      switch (entityName) {
        case "ThesisCoverImage":
          fileSpecs = context.thesisCoverImageFileSpec;
          break;

        case "ThesisDocument":
          fileSpecs = context.thesisDocumentFileSpec;
          break;

        default:
      }

      let id: string = req.params.id;
      let userId: number = (<UserSession>req.user).getId();
      let entry: Thesis | null = await context.service.entryExists(id, userId);
      let title: string = context.title;

      if (entry !== null) { title = entry.getTitle(); }

      res.render(context.getBaseViewPath() + "entry-update-object", { 'title': title, 'entry': entry, ...fileSpecs });
    }
  }

  public updateThesisObject(VxEntity: Newable<ThesisAttachment>, entityName: string, bucketName: string): RequestHandler {
    let context: AbstractBaseThesisController = this;
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      let fileSpecs: FileUploadSpec | null = null;
      let entryFile: ThesisAttachment | null = <ThesisAttachment>req.multipartFile;

      switch (entityName) {

        case "ThesisCoverImage":
          fileSpecs = context.thesisCoverImageFileSpec;
          break;

        case "ThesisDocument":
          fileSpecs = context.thesisDocumentFileSpec;
          break;

        default:
      }

      let id: string = req.params.id;
      let title: string = context.title;
      let userId: number = (<UserSession>req.user).getId();
      let entry: Thesis | null = await context.service.entryExists(id, userId);

      if (entry === null) throw new EntityNotFoundException();
      if (entry !== null) { title = entry.getTitle(); }
      if (req.validationErrors.isEmpty() === false) {
        res.render(context.getBaseViewPath() + "entry-update-object", { 'title': title, 'entry': entry, ...fileSpecs });
        return;
      }

      let thesisId: string = "";
      let slug: string = "";

      if (entry !== null) {
        thesisId = (<VxEntity>entry).getId().toString();
        slug = entry.getSlug();
      }

      entryFile = await context.service.updateThesisObject(thesisId, slug, entityName, entryFile, bucketName);

      if (entryFile !== null) {
        req.flash('success', 'Entry successfully updated.');
        res.redirect(context.backToEntries());
      }
      else { throw new Error("Failed to update entry."); }
    }
  }

  public saveThesisObjectII(VxEntity: Newable<ThesisAttachment>, entityName: string, bucketName: string): RequestHandler {
    let context: AbstractBaseThesisController = this;
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      let entry: ThesisAttachment | null = <ThesisAttachment>req.bindingModel;
      let slug: string = req.body.thesis_slug;

      if (req.validationErrors.isEmpty() === false) {
        let errors: string[] | null = req.validationErrors.getErrors();
        res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': errors } });
        return;
      }

      let thesisId: string = req.body.thesis_id;
      let entryUpdated: ThesisAttachment | null = await context.service.updateThesisObject(thesisId, slug, entityName, entry, bucketName);

      if (entryUpdated !== null) { res.status(200).json({ 'message': 'Action successful', 'details': { 'redirectUrl': context.backToHome() } }); }
      else { res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': [] } }); }
    }
  }

  public deleteThesisObjectII(VxEntity: Newable<ThesisAttachment>, entityName: string, bucketName: string): RequestHandler {
    let context: AbstractBaseThesisController = this;
    return async function (req: Request, res: Response, next: NextFunction): Promise<void> {
      let objectKey: string = req.params.objectkey;
      let entry: ThesisAttachment | null = await context.service.deleteThesisObjectByKey(objectKey, entityName, bucketName);
      if (entry !== null) { res.status(200).json({ 'message': 'Action successful' }); }
      else { res.status(400).json({ 'message': 'Action unsuccessful', 'details': { 'errors': [] } }); }
    }
  }

  public async updateOneContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = await this.service.updateOneContent(id, userId);
    let title: string = this.title;
    if (entry !== null) { title = entry.getTitle(); }
    res.render(this.getBaseViewPath() + "entry-update-content", { 'entry': entry, 'title': title });
  }

  public async updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Thesis | null = <Thesis>req.bindingModel;
    let userId: number = (<UserSession>req.user).getId();

    if (req.validationErrors.isEmpty() === false) {
      let entryExists: Thesis | null = await this.service.entryExists(id, userId);
      let title: string = this.title;

      if (entryExists !== null) { title = entryExists.getTitle(); }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update-content", { 'entry': entry, 'title': title });
      return;
    }

    entry = await this.service.updateContent(id, <Thesis>entry, userId);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to update entry."); }
  }

  protected getBaseViewPath(): string { return "pages/distinct/thesis/"; }

  protected backToEntries(): string { return "/internal/thesis/entries/"; }

  protected backToHome(): string { return "/internal/thesis/"; }

}