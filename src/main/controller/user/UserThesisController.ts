import { Request, Response, NextFunction } from 'express';
import { AbstractBaseThesisController } from '../abstract/AbstractBaseThesisController';
import { UserSession } from '../../entity/UserSession';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { VxEntity } from '../../entity/abstract/VxEntity';
import { Department } from '../../entity/Department';
import { Faculty } from '../../entity/Faculty';
import { ThesisGrade } from '../../entity/ThesisGrade';
import { Publisher } from '../../entity/Publisher';
import { UserThesisService } from '../../model/service/UserThesisService';
import { UserThesisServiceImpl } from '../../model/service/impl/UserThesisServiceImpl';
import { ThesisDeleteRequest } from '../../entity/ThesisDeleteRequest';
import { Thesis } from '../../entity/Thesis';

export class UserThesisController extends AbstractBaseThesisController {

  protected service: UserThesisService = new UserThesisServiceImpl();

  constructor(config: RouteOptionsConfig) { super(config); }

  public showSubmissionView(req: Request, res: Response, next: NextFunction): void {

    if ((<any>req.session).submission) {
      let title: string = (<any>req.session).submissionTitle;
      delete (<any>req.session).submissionTitle;
      delete (<any>req.session).submission;
      return res.render(this.getBaseViewPath() + "submission", { 'submissionTitle': title });
    }
    return next();
  }

  public showDeleteRequestSubmissionView(req: Request, res: Response, next: NextFunction): void {

    if ((<any>req.session).deleteRequest) {
      let title: string = (<any>req.session).deleteRequestThesisTitle;
      delete (<any>req.session).deleteRequest;
      delete (<any>req.session).deleteRequestThesisTitle;
      return res.render(this.getBaseViewPath() + "entry-delete-request-submission", { 'thesisTitle': title });
    }
    return next();
  }

  public static async setThesisDeleteRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new ThesisDeleteRequest(req.body);
      if (req.user !== null && req.user !== undefined) (<ThesisDeleteRequest>req.bindingModel).setRequesterId((<UserSession>req.user).getId());
    }
    else { req.bindingModel = new ThesisDeleteRequest({}); }
    return next();
  }

  public async findAllDeleteRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userId: number = (<UserSession>req.user).getId();
    let lastEntry: string = "";
    let firstEntry: string = "";
    let lastEntryId: string = "";
    let firstEntryId: string = "";
    let entries: ThesisDeleteRequest[] = await this.service.findAllDeleteRequest(req.queryConfig, userId);
    let totalCount: number = entries.length;

    if (entries.length > 0) {
      if (((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn()) { lastEntry = ((entries[entries.length - 1] as unknown) as VxEntity).getUpdatedOn().toString(); }
      if (((entries[entries.length - 1] as unknown) as VxEntity).getId()) { lastEntryId = ((entries[entries.length - 1] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getId()) { firstEntryId = ((entries[0] as unknown) as VxEntity).getId().toString(); }
      if (((entries[0] as unknown) as VxEntity).getUpdatedOn()) { firstEntry = ((entries[0] as unknown) as VxEntity).getUpdatedOn().toString(); }
    }

    res.render(this.getBaseViewPath() + "delete-request-entries", {
      'entries': entries, 'firstEntry': firstEntry, 'lastEntry': lastEntry, 'firstEntryId': firstEntryId, 'lastEntryId': lastEntryId,
      'totalCount': totalCount, 'title': this.title + ' Delete Request Entries'
    });
  }

  public async findOneDeleteRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: ThesisDeleteRequest | null = await this.service.findOneDeleteRequest(+id, userId);
    res.render(this.getBaseViewPath() + "delete-request-entry-detail", { 'entry': entry, 'title': this.title + ' Delete Request Entry Detail' });
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = await this.service.findOne(id, userId);
    let title: string = "User Thesis";

    if (entry !== null) { title = entry.getTitle(); }
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'title': title });
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
      (<any>req.session).submission = true;
      (<any>req.session).submissionTitle = entry.getTitle();
      res.redirect(this.backToHome() + "add");
    }
    else { throw new Error("An error has occured."); }
  }

  public async updateOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = await this.service.updateOne(id, userId);
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];
    let title: string = this.title;

    if (entry !== null) {
      faculties = await this.facultyService.selectOnlyNameAndId();
      if (faculties.length < 1) { throw new Error("An error has occured."); }
      thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
      publishers = await this.publisherService.selectOnlyNameAndId();
      departments = await this.departmentService.selectOnlyNameAndId();
      title = entry.getTitle();
    }
    res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers, 'title': title });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = <Thesis>req.bindingModel;
    let faculties: Faculty[] = [];
    let departments: Department[] = [];
    let thesisGrades: ThesisGrade[] = [];
    let publishers: Publisher[] = [];

    if (req.validationErrors.isEmpty() === false) {
      if (await this.service.existsOne(id)) {
        faculties = await this.facultyService.selectOnlyNameAndId();
        if (faculties.length < 1) { throw new Error("An error has occured."); }
        departments = await this.departmentService.selectOnlyNameAndId();
        thesisGrades = await this.thesisGradeService.selectOnlyNameAndId();
        publishers = await this.publisherService.selectOnlyNameAndId();
        departments = await this.departmentService.selectOnlyNameAndId();
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'departments': departments, 'faculties': faculties, 'thesisGrades': thesisGrades, 'publishers': publishers });
      return;
    }

    entry = await this.service.update(id, <Thesis>entry, userId);
    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to update entry."); }
  }

  public async deleteOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let slug: string = req.params.slug;
    let userId: number = (<UserSession>req.user).getId();
    let entry: Thesis | null = await this.service.entryExists(slug, userId);
    let entryId: number = 0;
    let title: string = this.title;

    if (entry !== null) {
      title = entry.getTitle();
      entryId = entry.getId();
    }
    res.render(this.getBaseViewPath() + "entry-delete-request", { 'entry': entry, 'title': title, 'entryId': entryId });
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let userId: number = (<UserSession>req.user).getId();
    let slug: string = req.params.slug;
    let entry: ThesisDeleteRequest | null = <ThesisDeleteRequest>req.bindingModel;
    let thesis: Thesis | null = await this.service.entryExists(slug, userId);
    let title: string = this.title;

    if (req.validationErrors.isEmpty() === false) {
      if (thesis !== null) { title = thesis.getTitle(); } else { entry = null; }
      res.render(this.getBaseViewPath() + "entry-delete-request", { 'entry': entry, 'title': title });
      return;
    }

    if (entry === null) return res.redirect(this.backToHome());
    let entryDeleteRequestSubmitted = await this.service.saveDeleteRequest(+id, entry);
    if (entryDeleteRequestSubmitted === true) {
      req.flash('success', 'Request successfully submitted.');
      (<any>req.session).deleteRequest = true;
      if (thesis !== null) {
        (<any>req.session).deleteRequestThesisTitle = thesis.getTitle();
        res.redirect(this.backToHome() + "delete/" + thesis.getId() + "/" + thesis.getSlug());
      }
    }
    else { throw new Error("Failed to delete entry."); }
  }

  protected getBaseViewPath(): string { return "pages/distinct/user-thesis/"; }

  protected backToHome(): string { return "/thesis/user/"; }

  protected backToEntries(): string { return "/thesis/user/entries/"; }

}