import { getRepository, SelectQueryBuilder } from 'typeorm';
import { VxEntityTwoRepositoryImpl } from '../abstract/VxEntityTwoRepositoryImpl';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { ServiceHelper } from '../../util/ServiceHelper';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { RoleRepository } from '../RoleRepository';
import { Role } from '../../../entity/Role';
import { UserRole } from '../../../entity/UserRole';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class RoleRepositoryImpl extends VxEntityTwoRepositoryImpl<Role> implements RoleRepository {

  protected readonly search: DefaultEntitySearch<Role> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<Role> = Role;

  public async findAll(q: EntityQueryConfig): Promise<Role[]> {
    let qb: SelectQueryBuilder<Role> = await getRepository(Role).createQueryBuilder(`vx`);
    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `word`) { this.search.word(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }
    return await qb.select([`vx._id`, `vx.name`, `vx.word`, `vx.created_on`, `vx.updated_on`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async updateOne(id: string | number, userId?: number): Promise<Role | null> {
    let entry: Role | undefined = await getRepository(Role).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.name`, `vx.word`, `vx.description`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async deleteOne(id: string | number, userId?: number): Promise<Role | null> {
    let entry: Role | undefined = await getRepository(Role).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.name`, `vx.word`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findUserRoles(id: number): Promise<Role[]> {
    let result: any[] = await getRepository(UserRole).createQueryBuilder(`vx`).leftJoinAndSelect(`role`, `rl`, `rl._id = vx.role_id`).where({ 'user_id': id })
      .select([`rl._id AS _id`, `rl.word AS name`]).execute();
    return ServiceHelper.rowsToObjectMapper<Role>(result, Role);
  }

  public async findUserSessionRoles(id: number): Promise<Role[]> {
    let result: any[] = await getRepository(UserRole).createQueryBuilder(`vx`).leftJoinAndSelect(`role`, `rl`, `rl._id = vx.role_id`).where({ 'user_id': id }).select([`rl._id AS _id`, `rl.name AS name`]).execute();
    return ServiceHelper.rowsToObjectMapper<Role>(result, Role);
  }

  public async updateOneUserRole(id: number): Promise<Role[]> {
    let result: any[] = await getRepository(UserRole).createQueryBuilder(`vx`).where({ 'user_id': id }).select([`vx.role_id AS _id`]).execute();
    return ServiceHelper.rowsToObjectMapper<Role>(result, Role);
  }

}