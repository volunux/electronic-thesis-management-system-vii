import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { BaseEntityController } from './abstract/BaseEntityController';
import { MailHelper } from '../helper/middleware/MailHelper';
import { MailMessage } from '../util/mail/MailMessage';
import { MailMessageImpl } from '../util/mail/MailMessageImpl';
import { MailSender } from '../util/mail/MailSender';
import { MailSenderServicesContainer } from '../util/mail/MailSenderServicesContainer';
import { Newable } from '../entity/interface/Newable';
import { User } from '../entity/User';
import { UserSession } from '../entity/UserSession';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisDeleteRequestServiceImpl } from '../model/service/impl/ThesisDeleteRequestServiceImpl';
import { ThesisDeleteRequestService } from '../model/service/ThesisDeleteRequestService';
import { ThesisDeleteRequest } from '../entity/ThesisDeleteRequest';
import { ThesisDeleteRequestStatus } from '../entity/ThesisDeleteRequestStatus';
import { ThesisDeleteRequestStatusService } from '../model/service/ThesisDeleteRequestStatusService';
import { ThesisDeleteRequestStatusServiceImpl } from '../model/service/impl/ThesisDeleteRequestStatusServiceImpl';

export class ThesisDeleteRequestController extends BaseEntityController<ThesisDeleteRequest> {

  protected service: ThesisDeleteRequestService = new ThesisDeleteRequestServiceImpl();
  protected statusService: ThesisDeleteRequestStatusService = new ThesisDeleteRequestStatusServiceImpl();
  protected VxEntity: Newable<ThesisDeleteRequest> = ThesisDeleteRequest;
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');

  constructor(config: RouteOptionsConfig) {
    super(config, ThesisDeleteRequest);
  }

  public static setThesisDeleteRequest(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) {
      req.bindingModel = new ThesisDeleteRequest(req.body);
      if (req.user !== null && req.user !== undefined) (<ThesisDeleteRequest>req.bindingModel).setHandlerId((<UserSession>req.user).getId());
    }
    else { req.bindingModel = new ThesisDeleteRequest({}); }

    return next();
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: ThesisDeleteRequest | null = await this.service.findOne(+id);
    let statuses: ThesisDeleteRequestStatus[] = await this.statusService.selectOnlyNameAndId();
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'title': this.title + ' Entry Update', 'statuses': statuses });
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: ThesisDeleteRequest | null = <ThesisDeleteRequest>req.bindingModel;

    if (req.validationErrors.isEmpty() === false) {
      let existingEntry: ThesisDeleteRequest | null = await this.service.findOne(+id);
      let statuses: ThesisDeleteRequestStatus[] = [];
      if (existingEntry !== null) {
        existingEntry.setResponse(entry.getResponse());
        statuses = await this.statusService.selectOnlyNameAndId();
      }
      else { entry = null; }
      res.render(this.getBaseViewPath() + "entry-detail", { 'entry': existingEntry, 'statuses': statuses, 'title': this.title + ' Entry Update' });
      return;
    }

    let user: User = new User({});
    user.setEmailAddress(entry.getEmailAddress());
    let fullName: string = req.body.full_name;
    let datas: { [key: string]: any } = { 'host': (<IncomingHttpHeaders>req.headers).host as string, 'full_name': fullName };
    let mailMessage: MailMessage = new MailMessageImpl('Thesis Delete Request Status', "");
    MailHelper.renderTemplateAndSend(res, 'templates/thesis-delete-request-status', this.mailSender, mailMessage, <any>user, datas);

    let entryUpdated: ThesisDeleteRequest | null = await this.service.update(+id, entry);
    if (entryUpdated !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  protected backToEntries(): string { return "/internal/thesis-delete-request/entries/"; }

  protected backToHome(): string { return "/internal/thesis-delete-request/"; }

  protected getBaseViewPath(): string { return "pages/distinct/thesis-delete-request/"; }

}