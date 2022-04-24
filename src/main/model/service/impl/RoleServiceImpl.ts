import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { RoleService } from '../RoleService';
import { RoleRepository } from '../../repository/RoleRepository';
import { RoleRepositoryImpl } from '../../repository/impl/RoleRepositoryImpl';
import { Role } from '../../../entity/Role';

export class RoleServiceImpl extends AbstractBaseServiceImpl<Role> implements RoleService {

  protected readonly repository : RoleRepository = new RoleRepositoryImpl();

  public async findUserRoles(id : number) : Promise<Role[]> { return this.repository.findUserRoles(id); }

  public async findUserSessionRoles(id : number) : Promise<Role[]> { return this.repository.findUserSessionRoles(id); }

  public async updateOneUserRole(id : number) : Promise<Role[]> { return this.repository.findUserRoles(id); }
}
