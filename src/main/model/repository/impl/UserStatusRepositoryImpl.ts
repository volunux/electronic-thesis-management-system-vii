import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { UserStatusRepository } from '../UserStatusRepository';
import { UserStatus } from '../../../entity/UserStatus';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class UserStatusRepositoryImpl extends VxEntityTwoRepositoryImpl<UserStatus> implements UserStatusRepository {

  protected readonly search: DefaultEntitySearch<UserStatus> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<UserStatus> = UserStatus;

}