import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { Role } from '../../entity/Role';

export interface RoleRepository extends CrudRepositoryX<Role> {

  findUserRoles(id: number): Promise<Role[]>;
  updateOneUserRole(id: number): Promise<Role[]>;
  findUserSessionRoles(userId: number): Promise<Role[]>;
} 