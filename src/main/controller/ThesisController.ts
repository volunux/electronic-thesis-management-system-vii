import { Request, Response, RequestHandler, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { AbstractBaseThesisController } from './abstract/AbstractBaseThesisController';
import { MailHelper } from '../helper/middleware/MailHelper';
import { MailMessage } from '../util/mail/MailMessage';
import { MailMessageImpl } from '../util/mail/MailMessageImpl';
import { MailSender } from '../util/mail/MailSender';
import { MailSenderServicesContainer } from '../util/mail/MailSenderServicesContainer';
import { FileUploadSpec } from '../entity/interface/FileUploadSpec';
import { VxEntity } from '../entity/abstract/VxEntity';
import { Faculty } from '../entity/Faculty';
import { Department } from '../entity/Department';
import { Publisher } from '../entity/Publisher';
import { User } from '../entity/User';
import { ThesisServiceImpl } from '../model/service/impl/ThesisServiceImpl';
import { ThesisService } from '../model/service/ThesisService';
import { Thesis } from '../entity/Thesis';
import { ThesisGrade } from '../entity/ThesisGrade';
import { ThesisStatus } from '../entity/ThesisStatus';

export class ThesisController extends AbstractBaseThesisController {

  protected service: ThesisService = new ThesisServiceImpl();
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');
  protected thesisDocumentFileSpec: FileUploadSpec = { 'fileSize': 204800, 'uploadUrl': '/internal/thesis/document/', 'fileType': 'application', 'label': 'Thesis Document', 'accept': 'application/*', 'fieldName': 'thesis_document', 'file_upl': true };
  protected thesisCoverImageFileSpec: FileUploadSpec = { 'fileSize': 1048576, 'uploadUrl': '/internal/thesis/cover-image/', 'fileType': 'image', 'label': 'Thesis Cover Image', 'accept': 'image/*', 'fieldName': 'thesis_cover_image', 'file_upl': true };

  constructor(config: RouteOptionsConfig) { super(config); }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    let path: string = req.path;
    let lastEntry: string = "";
    let firstEntry: string = "";
    let lastEntryId: string = "";
    let firstEntryId: string = "";
    let entries: Thesis[] = [];
    let viewName: string = this.getBaseViewPath() + "/entries";

    if (path.endsWith("/submission")) {
      entries = await this.service.findAllSubmission(req.queryConfig);
      viewName = this.getBaseViewPath() + "submission-entries";
    }
    else { entries = await this.service.findAll(req.queryConfig); }

    let totalCount: number = entries.length;
    if (entries.length > 0) {
      if (((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn()) { lastEntry = ((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn().toString(); }
      if (((entries[entries.length - 1] as unknown) as VxEntity).getId()) { lastEntryId = ((entries[entries.length - 1] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getId()) { firstEntryId = ((entries[0] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getUpdatedOn()) { firstEntry = ((entries[0] as unknown) as VxEntity).getUpdatedOn().toString(); }
    }

    res.render(viewName, {
      'entries': entries, 'firstEntry': firstEntry, 'lastEntry': lastEntry, 'firstEntryId': firstEntryId, 'lastEntryId': lastEntryId, 'totalCount': totalCount,
      'title': this.title + ' Entries'
    });
  }

  public async save(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: Thesis | null = <Thesis>req.bindingModel;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];

    if (req.validationErrors.isEmpty() === false) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
      publishers = await this.publisherService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();
      res.render(this.getBaseViewPath() + "entry-create", { 'entry': entry, 'title': this.title + ' Entry Add', 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers });
      return;
    }

    entry.setSlug(`${entry.getTitle().split(' ').join('-')}-${Math.floor(Math.random() * 1000000)}`);
    entry = await this.service.save(<Thesis>entry);
    if (entry !== null) {
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id = req.params.id;
    let entry: Thesis | null = await this.service.updateOne(id);
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];
    let statuses: ThesisStatus[] = [];
    let title: string = this.title;

    if (entry !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
      publishers = await this.publisherService.selectOnlyNameAndId();
      statuses = await this.thesisStatusService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();
      title = entry.getTitle();
    }

    res.render(this.getBaseViewPath() + 'entry-update', {
      'title': title, 'entry': entry, 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers,
      'statuses': statuses
    });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Thesis | null = <Thesis>req.bindingModel;
    let title: string = this.title;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];
    let statuses: ThesisStatus[] = [];

    if (req.validationErrors.isEmpty() === false) {
      let existingEntry: Thesis | null = await this.service.entryExists(id);
      if (existingEntry !== null) {
        faculties = await this.facultyService.selectOnlyNameAndId();
        if (faculties.length < 1) { throw new Error("An error has occured."); }
        departments = await this.departmentService.selectOnlyNameAndId();
        thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
        publishers = await this.publisherService.selectOnlyNameAndId();
        statuses = await this.thesisStatusService.selectOnlyNameAndId();
        departments = await this.departmentService.selectOnlyNameAndId();
        title = entry.getTitle();
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", {
        'title': title, 'entry': entry, 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers,
        'statuses': statuses
      });
      return;
    }

    entry = await this.service.update(id, <Thesis>entry);
    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  public async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let status: string = req.body.status;
    let entryExists: boolean = await this.service.existsOne(id);

    if (entryExists === false) { throw new Error("An error has occured."); }

    if (req.validationErrors.isEmpty() === false) {
      let statuses: ThesisStatus[] = [];
      statuses = await this.thesisStatusService.selectOnlyNameAndId();
      let entry: Thesis | null = await this.service.findOne(id);
      if (entry !== null) { if (statuses.length < 1) { throw new Error("An error has occured."); } }
      else { entry = null; }
      res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'statuses': statuses });
      return;
    }

    let entryUpdated: boolean = await this.service.updateStatus(id, status);
    if (entryUpdated === false) { throw new Error("An error has occured."); }
    req.flash('success', 'Entry successfully updated.');
    if (req.url.startsWith('/submission/detail/')) {
      let emailAddress: string = req.body.uploader_email_address;
      let fullName: string = req.body.name_of_uploader;
      let user = new User({});
      user.setEmailAddress(emailAddress);

      if (user !== null) {
        let datas: { [key: string]: any } = { 'host': (<IncomingHttpHeaders>req.headers).host as string, 'full_name': fullName };
        let mailMessage: MailMessage = new MailMessageImpl('Thesis Submission Status', "");
        MailHelper.renderTemplateAndSend(res, 'templates/thesis-submission-status', this.mailSender, mailMessage, <any>user, datas);
      }
      return res.redirect(this.backToHome() + "submission");
    }
    res.redirect(this.backToEntries());
  }

  protected getBaseViewPath(): string { return "pages/distinct/thesis/"; }

  protected backToEntries(): string { return "/internal/thesis/entries/"; }

  protected backToHome(): string { return "/internal/thesis/"; }

}