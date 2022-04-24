import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisReplyServiceImpl } from '../model/service/impl/ThesisReplyServiceImpl';
import { ThesisReplyService } from '../model/service/ThesisReplyService';
import { ThesisReply } from '../entity/ThesisReply';
import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';

export class ThesisReplyController extends BaseEntityController<ThesisReply> {

  protected service: ThesisReplyService = new ThesisReplyServiceImpl();
  protected VxEntity: Newable<ThesisReply> = ThesisReply;

  constructor(config: RouteOptionsConfig) { super(config, ThesisReply); }

  protected backToEntries(): string { return "/internal/thesis-reply/entries/"; }

  protected backToHome(): string { return "/internal/thesis-reply/"; }

  protected getBaseViewPath(): string { return "pages/shared/three/"; }

}