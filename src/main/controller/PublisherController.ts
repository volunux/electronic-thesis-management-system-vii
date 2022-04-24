import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { PublisherServiceImpl } from '../model/service/impl/PublisherServiceImpl';
import { PublisherService } from '../model/service/PublisherService';
import { Publisher } from '../entity/Publisher';

export class PublisherController extends BaseEntityController<Publisher> {

  protected service: PublisherService = new PublisherServiceImpl();
  protected VxEntity: Newable<Publisher> = Publisher;

  constructor(config: RouteOptionsConfig) { super(config, Publisher); }

  protected backToEntries(): string { return "/internal/publisher/entries/"; }

  protected backToHome(): string { return "/internal/publisher/"; }

  protected getBaseViewPath(): string { return "pages/shared/two/"; }

}