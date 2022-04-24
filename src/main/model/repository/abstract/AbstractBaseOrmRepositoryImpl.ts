import { DeleteResult, getRepository, SelectQueryBuilder, UpdateResult, EntityManager } from 'typeorm';
import DataSource from '../../query/util/DataSource';
import QueryClient from '../../query/util/QueryClient';
import { QueryTemplate } from '../../query/util/QueryTemplate';
import { QueryClientImpl } from '../../query/util/QueryClientImpl';
import { OrmQueryClientImpl } from '../../query/util/OrmQueryClientImpl';
import { SimpleQueryTemplate } from '../../query/util/SimpleQueryTemplate';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { CrudRepository } from '../generic/Repository';
import { Newable } from '../../../entity/interface/Newable';
import { ServiceHelper } from '../../util/ServiceHelper';
import { AbstractBaseEntitySearch } from '../../../helper/search/abstract/AbstractBaseEntitySearch';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export abstract class AbstractBaseOrmRepositoryImpl<T> implements CrudRepository<T> {

  protected queryTemplate: QueryTemplate<T> = new SimpleQueryTemplate<T>(new DataSource());
  protected abstract VxEntity: Newable<T>;
  protected client: QueryClient | null = null;
  protected transactionManager: EntityManager | null = null;
  protected entityName: string;
  protected abstract search: AbstractBaseEntitySearch<T>;

  public async findOne(id: string | number, userId?: number): Promise<T | null> {
    let entry: T | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async selectOnlyNameAndId(): Promise<T[]> { return []; }

  public async existsOne(id: string | number): Promise<boolean> {
    let entry: T | undefined;
    entry = await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({ '_id': id }).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  }

  public async findAll(eqp: EntityQueryConfig): Promise<T[]> { return []; }

  protected async findAllInternal(q: EntityQueryConfig): Promise<SelectQueryBuilder<T>> {
    let qb: SelectQueryBuilder<T> = await getRepository(this.VxEntity).createQueryBuilder(`vx`);
    if (q !== null && q !== undefined) {
      if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }
    return qb;
  }

  public async addOne(): Promise<T> { return new this.VxEntity({}); }

  public async save(entry: T): Promise<T | null> {
    let newEntry: T = await getRepository(this.VxEntity).save(entry as any);
    if (newEntry === undefined) return null;
    return newEntry;
  }

  public async insert(entry: T): Promise<boolean> {
    let newEntry: T | null = await this.save(entry);
    if (newEntry === null) return false;
    return true;
  }

  public async update(id: string | number, entry: T, userId?: number): Promise<T | null> {
    let updatedEntry: T | undefined = await getRepository(this.VxEntity).save(entry as any);
    if (updatedEntry === undefined) return null;
    return updatedEntry;
  }

  public async persist(entry: T): Promise<T | null> { return await this.save(entry); }

  public async saveMany(entries: T[]): Promise<boolean> { return true; }

  public async updateOne(id: string | number, userId?: number): Promise<T | null> { return null; }

  public async deleteOne(id: string | number, userId?: number): Promise<T | null> { return null; }

  public async remove(id: string | number, userId?: number): Promise<T | null> {
    let entry: T | null = null;
    let result: DeleteResult = await getRepository(this.VxEntity).createQueryBuilder(`vx`).delete().where({ '_id': id }).returning(`_id`).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new this.VxEntity(result.raw[0]); }
    }
    return entry;
  }

  public async deleteMany(entries: string | string[]): Promise<T[]> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let result: DeleteResult = manager !== null ? await manager!.getRepository(this.VxEntity).createQueryBuilder(`vx`).delete().whereInIds(entries).returning(`_id`).execute() :
      await getRepository(this.VxEntity).createQueryBuilder(`vx`).delete().whereInIds(entries).returning(`_id`).execute();
    return ServiceHelper.rowsToObjectMapper<T>(<any>result.raw, this.VxEntity);
  }

  public async deleteAll(): Promise<T[]> { return await getRepository(this.VxEntity).createQueryBuilder(`vx`).where({}).select([`vx._id`]).limit(1).getMany(); }

  public async findAndDeleteAll(): Promise<T[]> {
    let result: DeleteResult = await getRepository(this.VxEntity).createQueryBuilder(`vx`).delete().where({}).returning(`_id`).execute();
    return ServiceHelper.rowsToObjectMapper<T>(<any>result.raw, this.VxEntity);
  }

  public async relatedEntities(entry: T): Promise<T | null> { return null; }

  public getQueryTemplate(): QueryTemplate<T> { return this.queryTemplate; }

  public getClient(): QueryClient {
    if (this.client !== null) { return this.client; }
    else { return new QueryClientImpl(); }
  }

  public setClient(client: QueryClient | null): void { this.client = client; }

  public getTransactionManager(): EntityManager | null { return this.transactionManager; }

  public setTransactionManager(manager: EntityManager | null): void { this.transactionManager = manager; }

  public getOrmClient(): QueryClient { return new OrmQueryClientImpl(); }

}