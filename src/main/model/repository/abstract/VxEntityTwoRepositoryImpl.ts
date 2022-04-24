import { getRepository, SelectQueryBuilder } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export abstract class VxEntityTwoRepositoryImpl<T> extends AbstractBaseOrmRepositoryImpl<T> {

  protected readonly search: DefaultEntitySearch<T> = DefaultEntitySearch.getInstance({});
  protected abstract VxEntity: Newable<any>;

  public async findOne(id: string | number, userId?: number): Promise<T | null> {
    let entry: T | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.user`, `usr`).where({ '_id': id })
      .select([`vx`, `usr._id`, `usr.first_name`, `usr.last_name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async selectOnlyNameAndId(): Promise<T[]> { return await getRepository(this.VxEntity).createQueryBuilder(`vx`).select([`vx._id`, `vx.name`]).getMany(); }

  public async findAll(q: EntityQueryConfig): Promise<T[]> {
    let qb: SelectQueryBuilder<T> = await getRepository(this.VxEntity).createQueryBuilder(`vx`);
    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `name`) { this.search.label(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }
    return await qb.select([`vx._id`, `vx.name`, `vx.updated_on`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async updateOne(id: string | number, userId?: number): Promise<T | null> {
    let entry: T | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.name`, `vx.description`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async deleteOne(id: string | number, userId?: number): Promise<T | null> {
    let entry: T | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`, `vx.name`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

}