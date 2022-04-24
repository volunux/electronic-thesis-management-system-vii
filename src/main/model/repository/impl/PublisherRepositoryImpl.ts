import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { PublisherRepository } from '../PublisherRepository';
import { Publisher } from '../../../entity/Publisher';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class PublisherRepositoryImpl extends VxEntityTwoRepositoryImpl<Publisher> implements PublisherRepository {

  protected readonly search: DefaultEntitySearch<Publisher> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<Publisher> = Publisher;

}