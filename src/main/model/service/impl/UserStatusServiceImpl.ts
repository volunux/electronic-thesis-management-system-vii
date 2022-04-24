import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { UserStatusRepository } from '../../repository/UserStatusRepository';
import { UserStatusRepositoryImpl } from '../../repository/impl/UserStatusRepositoryImpl';
import { UserStatus } from '../../../entity/UserStatus';

export class UserStatusServiceImpl extends AbstractBaseServiceImpl<UserStatus> {
  protected readonly repository : UserStatusRepository = new UserStatusRepositoryImpl();
}