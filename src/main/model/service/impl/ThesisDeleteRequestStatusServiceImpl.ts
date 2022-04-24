import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ThesisDeleteRequestStatusRepository } from '../../repository/ThesisDeleteRequestStatusRepository';
import { ThesisDeleteRequestStatusRepositoryImpl } from '../../repository/impl/ThesisDeleteRequestStatusRepositoryImpl';
import { ThesisDeleteRequestStatus } from '../../../entity/ThesisDeleteRequestStatus';

export class ThesisDeleteRequestStatusServiceImpl extends AbstractBaseServiceImpl<ThesisDeleteRequestStatus> {

  protected readonly repository : ThesisDeleteRequestStatusRepository = new ThesisDeleteRequestStatusRepositoryImpl();
}