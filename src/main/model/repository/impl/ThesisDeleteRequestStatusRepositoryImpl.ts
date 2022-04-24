import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisDeleteRequestStatusRepository } from '../ThesisDeleteRequestStatusRepository';
import { ThesisDeleteRequestStatus } from '../../../entity/ThesisDeleteRequestStatus';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisDeleteRequestStatusRepositoryImpl extends VxEntityTwoRepositoryImpl<ThesisDeleteRequestStatus> implements ThesisDeleteRequestStatusRepository {

  protected readonly search : DefaultEntitySearch<ThesisDeleteRequestStatus> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity : Newable<ThesisDeleteRequestStatus> = ThesisDeleteRequestStatus;
}