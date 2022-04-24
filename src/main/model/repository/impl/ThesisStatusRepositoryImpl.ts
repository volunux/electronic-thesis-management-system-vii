import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisStatusRepository } from '../ThesisStatusRepository';
import { ThesisStatus } from '../../../entity/ThesisStatus';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisStatusRepositoryImpl extends VxEntityTwoRepositoryImpl<ThesisStatus> implements ThesisStatusRepository {

  protected readonly search: DefaultEntitySearch<ThesisStatus> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<ThesisStatus> = ThesisStatus;

}