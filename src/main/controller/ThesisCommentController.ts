import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { ThesisCommentServiceImpl } from '../model/service/impl/ThesisCommentServiceImpl';
import { ThesisCommentService } from '../model/service/ThesisCommentService';
import { ThesisComment } from '../entity/ThesisComment';
import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';

export class ThesisCommentController extends BaseEntityController<ThesisComment> {

  protected service: ThesisCommentService = new ThesisCommentServiceImpl();
  protected VxEntity: Newable<ThesisComment> = ThesisComment;

  constructor(config: RouteOptionsConfig) { super(config, ThesisComment); }

  protected backToEntries(): string { return "/internal/thesis-comment/entries/"; }

  protected backToHome(): string { return "/internal/thesis-comment/"; }

  protected getBaseViewPath(): string { return "pages/shared/three/"; }

}