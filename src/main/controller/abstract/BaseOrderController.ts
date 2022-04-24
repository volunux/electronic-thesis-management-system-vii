import { Request, Response, NextFunction } from 'express';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { OrderService } from '../../model/service/OrderService';
import { OrderStatusService } from '../../model/service/OrderStatusService';
import { CheckoutService } from '../../model/service/CheckoutService';
import { CheckoutServiceImpl } from '../../model/service/impl/CheckoutServiceImpl';
import { OrderStatusServiceImpl } from '../../model/service/impl/OrderStatusServiceImpl';
import { PaymentHelper } from '../../helper/shop/PaymentHelper';
import { MailHelper } from '../../helper/middleware/MailHelper';
import { MailMessage } from '../../util/mail/MailMessage';
import { MailMessageImpl } from '../../util/mail/MailMessageImpl';
import { MailSender } from '../../util/mail/MailSender';
import { MailSenderServicesContainer } from '../../util/mail/MailSenderServicesContainer';
import { Order } from '../../entity/Order';
import { OrderStatus } from '../../entity/OrderStatus';
import { CommonEntityController } from './CommonEntityController';
import { VxEntity } from '../../entity/abstract/VxEntity';
import { Newable } from '../../entity/interface/Newable';
import { UserSession } from '../../entity/UserSession';

export abstract class BaseOrderController extends CommonEntityController<Order, OrderStatus> {

  protected abstract service: OrderService;
  protected statusService: OrderStatusService = new OrderStatusServiceImpl();
  private checkoutService: CheckoutService = new CheckoutServiceImpl();
  private paymentService: PaymentHelper = new PaymentHelper();
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');
  protected VxEntity: Newable<Order> = Order;

  constructor(config: RouteOptionsConfig) { super(config, Order); }

  public async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {

    let path: string = req.path;
    let lastEntry: string = "";
    let firstEntry: string = "";
    let lastEntryId: string = "";
    let firstEntryId: string = "";
    let entries: Order[] = [];
    let viewName: string = this.getBaseViewPath() + "/entries";
    let userId: number = (<UserSession>req.user).getId();

    if (path.endsWith("/incomplete")) {
      viewName = this.getBaseViewPath() + 'incomplete-entries';
      entries = await this.service.findNonComplete(req.queryConfig, userId);
    }
    else { entries = await this.service.findAll(req.queryConfig, userId); }

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

  public async verifyOrder(req: Request, res: Response, next: NextFunction): Promise<void> {

    let reference: string = req.params.reference;
    let transactionDetails: any = await this.paymentService.verifyTransaction(reference);
    let processed: boolean = false;
    let user: UserSession = <UserSession>req.user;

    if (transactionDetails.status === "success") {
      this.checkoutService.updateTransactionStatus(reference, 'Completed');
      processed = true;
    }
    else { await this.checkoutService.updateTransactionStatus(reference, 'Failed'); }

    let status: string = "Unsuccessful";

    if (processed === true) {
      status = "Successful";
      let mailMessage: MailMessage = new MailMessageImpl('Transaction Completed', "");
      let datas: { [key: string]: any } = { 'reference': reference, 'status': status };
      MailHelper.renderTemplateAndSend(res, 'templates/transaction-completed', this.mailSender, mailMessage, <any>user, datas);
      req.flash('success', `Transaction or Order ${status}ly processed.`);
      res.redirect(this.backToEntries());
    }

    else {
      req.flash('success', `Transaction or Order ${status}ly processed.`);
      res.redirect(this.backToHome() + 'incomplete?type=status&search=Pending&search=Failed');
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {

    let entry: Order | null = <Order>req.bindingModel;
    let id: string = req.params.id;
    let statuses: OrderStatus[] = [];

    if (req.validationErrors.isEmpty() === false) {
      entry = await this.service.findOne(id);
      if (entry !== null) {
        statuses = await this.statusService.selectOnlyNameAndId();
        if (statuses.length < 1) { throw new Error("An error has occured."); }
      }
      else { entry = null; }

      res.render(this.getBaseViewPath() + "entry-update", { 'entry': entry, 'statuses': statuses, 'title': this.title + ' Entry Update' });
      return;
    }

    entry = await this.service.update(id, <Order>entry);

    if (entry !== null) {
      req.flash('success', 'Entry successfully updated.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("An error has occured."); }
  }

  protected backToEntries(): string { return "/internal/order/entries/"; }

  protected backToHome(): string { return "/internal/order/"; }

  protected getBaseViewPath(): string { return "pages/distinct/order/"; }

}