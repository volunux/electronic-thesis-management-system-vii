import { CrudServiceX } from './abstract/CrudServiceX';
import { Role } from '../../entity/Role';

export interface RoleService extends CrudServiceX<Role> {
  findUserRoles(id : number) : Promise<Role[]>;
  updateOneUserRole(id : number) : Promise<Role[]>;
  findUserSessionRoles(id : number) : Promise<Role[]>;
}
