import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisDeleteRequestRepository } from '../../repository/ThesisDeleteRequestRepository';
import { ThesisDeleteRequestRepositoryImpl } from '../../repository/impl/ThesisDeleteRequestRepositoryImpl';
import { ThesisDeleteRequest } from '../../../entity/ThesisDeleteRequest';

export class ThesisDeleteRequestServiceImpl extends AbstractBaseServiceImpl<ThesisDeleteRequest> {

  protected readonly repository : ThesisDeleteRequestRepository = new ThesisDeleteRequestRepositoryImpl();
}
