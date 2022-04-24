import { Request, Response, NextFunction } from 'express';
import { Newable } from '../../entity/interface/Newable';
import { BaseEntityController } from '../../controller/abstract/BaseEntityController';
import { GeneralFilter } from '../../helper/filter/GeneralFilter';
import { ShoppingCartHelper } from '../../helper/shop/ShoppingCartHelper';
import { RouteOptionsConfig } from '../../route/config/RouteOptionsConfig';
import { GeneralThesisService } from '../../model/service/GeneralThesisService';
import { GeneralThesisServiceImpl } from '../../model/service/impl/GeneralThesisServiceImpl';
import { UserService } from '../../model/service/UserService';
import { UserServiceImpl } from '../../model/service/impl/UserServiceImpl';
import { Thesis } from '../../entity/Thesis';
import { ShoppingCart } from '../../entity/ShoppingCart';
import { OrderItem } from '../../entity/OrderItem';
import { ThesisComment } from '../../entity/ThesisComment';
import { ThesisReply } from '../../entity/ThesisReply';
import { User } from '../../entity/User';
import { UserSession } from '../../entity/UserSession';
import { EntityNotFoundException } from '../../entity/error/EntityNotFoundException';

export class GeneralThesisController extends BaseEntityController<Thesis> {

  protected service: GeneralThesisService = new GeneralThesisServiceImpl();
  private userService: UserService = new UserServiceImpl();
  protected VxEntity: Newable<Thesis> = Thesis;

  constructor(config: RouteOptionsConfig) { super(config, Thesis); }

  public setEntityAttr(req: Request, res: Response, next: NextFunction): void {
    res.locals.title = this.title;
    res.locals.search_criteria = (<RouteOptionsConfig>this.config).getRouteSearchCriteria();
    let cart: ShoppingCart | undefined = req.session.cart;
    let orderItems: OrderItem[] = ShoppingCartHelper.getItems(<ShoppingCart>cart);
    let cartItemsId: OrderItem[] = GeneralFilter.arrayOfCusObjectFieldFilter(['item_id'], orderItems);
    res.locals.cartItemsId = cartItemsId;

    return next();
  }

  public async findOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Thesis | null = await this.service.findOne(id);
    let relatedEntries: Thesis[] = [];
    if (entry === null) throw new EntityNotFoundException();
    relatedEntries = await this.service.findRelatedEntries(entry.getId());
    res.render(this.getBaseViewPath() + "entry-detail", { 'entry': entry, 'relatedEntries': relatedEntries, 'title': this.title + ' Entry Detail' });
  }

  public static async noResource(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.render("pages/general/thesis/no-resource", { 'title': 'Resource not found' });
  }

  public async findDiscussion(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entries: ThesisComment[] = await this.service.findDiscussion(+id);
    res.render(this.getBaseViewPath() + "discussion", { 'entries': entries, 'title': this.title + ' Discussion' });
  }

  public async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: Thesis | null = await this.service.entryExists(id);
    let title: string = this.title;

    if (entry === null) throw new EntityNotFoundException();

    let thesisId: number = entry.getId();
    title = entry.getTitle();
    res.render(this.getBaseViewPath() + "comment-create", { 'entry': entry, 'thesis_id': thesisId, 'title': title, 'thesis_title': title });
  }

  public async saveComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: ThesisComment | null = <ThesisComment>req.bindingModel;
    let userId: number = 0;

    if (req.user && (<UserSession>req.user).getId) userId = (<UserSession>req.user).getId();

    let user: User | null = await this.userService.findFullNameAndOthers(userId);
    if (user !== null) entry.setAuthorName(user.getFirstName() + ' ' + user.getLastName());

    let thesisId: number = 0;
    let entryExists: Thesis | null = await this.service.entryExists(id);
    if (entryExists === null) throw new EntityNotFoundException();

    if (req.validationErrors.isEmpty() === false) {
      thesisId = entryExists.getId();
      res.render(this.getBaseViewPath() + "comment-create", { 'entry': entry, 'thesis_id': thesisId, 'title': this.title });
      return;
    }

    if (entryExists === null) return res.redirect('/');

    let saved: boolean = await this.service.saveComment(<ThesisComment>entry);
    if (saved === true) {
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to save entry."); }
  }

  public async addReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let commentId: string = req.params.comment;
    if (!(await this.service.existsCommentEntry(+id))) throw new EntityNotFoundException();
    if (!(await this.service.existsComment(+commentId))) throw new EntityNotFoundException();

    res.render(this.getBaseViewPath() + "reply-create", { 'title': this.title, 'comment_id': commentId });
  }

  public async saveReply(req: Request, res: Response, next: NextFunction): Promise<void> {
    let id: string = req.params.id;
    let entry: ThesisReply | null = <ThesisReply>req.bindingModel;
    let userId: number = 0;

    if (req.user && (<UserSession>req.user).getId) userId = (<UserSession>req.user).getId();
    let user: User | null = await this.userService.findFullNameAndOthers(userId);
    if (user !== null) entry.setAuthorName(user.getFirstName() + ' ' + user.getLastName());

    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + "reply-create", { 'entry': entry, 'title': this.title });
      return;
    }

    if (!(await this.service.existsCommentEntry(+id))) throw new EntityNotFoundException();
    let saved: boolean = await this.service.saveReply(<ThesisReply>entry);
    if (saved === true) {
      req.flash('success', 'Entry successfully added.');
      res.redirect(this.backToEntries());
    }
    else { throw new Error("Failed to save entry."); }
  }

  protected getBaseViewPath(): string { return "pages/general/thesis/"; }

}