import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { PublisherRepository } from '../../repository/PublisherRepository';
import { PublisherRepositoryImpl } from '../../repository/impl/PublisherRepositoryImpl';
import { Publisher } from '../../../entity/Publisher';

export class PublisherServiceImpl extends AbstractBaseServiceImpl<Publisher> {

  protected readonly repository : PublisherRepository = new PublisherRepositoryImpl();
}