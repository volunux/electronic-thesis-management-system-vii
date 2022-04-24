import DataSource from '../../query/util/DataSource';
import QueryClient from '../../query/util/QueryClient';
import { QueryTemplate } from '../../query/util/QueryTemplate';
import { QueryClientImpl } from '../../query/util/QueryClientImpl';
import { AbstractBaseQuery } from '../../query/interface/AbstractBaseQuery';
import { SimpleQueryTemplate } from '../../query/util/SimpleQueryTemplate';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { CrudRepositoryX } from '../generic/CrudRepositoryX';
import { Newable } from '../../../entity/interface/Newable';

export abstract class AbstractBaseRepositoryImpl<T> implements CrudRepositoryX<T> {

  protected queryTemplate: QueryTemplate<T> = new SimpleQueryTemplate<T>(new DataSource());
  protected abstract VxEntity: Newable<T>;
  protected abstract query: AbstractBaseQuery<T>;
  protected client: QueryClient | null = null;

  public async findOne(id: string | number, userId?: number): Promise<T | null> {
    let plan: DynamicQuery = this.query.findOne(id, userId);
    return await this.queryTemplate.findOne(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async saveMany(entries: T[]): Promise<boolean> {
    return true;
  }

  public async selectOnlyNameAndId(): Promise<T[]> {
    let plan: DynamicQuery = this.query.selectOnlyNameAndId();
    return await this.queryTemplate.findAll(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async existsOne(id: string | number): Promise<boolean> {
    let plan: DynamicQuery = this.query.existsOne(id);
    return await this.queryTemplate.existsOne(plan.getText(), plan.getValues());
  }

  public async findAll(eqp: EntityQueryConfig): Promise<T[]> {
    let plan: DynamicQuery = this.query.findAll(eqp);
    return await this.queryTemplate.findAll(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async addOne(): Promise<T> {
    let entry: T = new this.VxEntity({});
    return entry;
  }

  public async save(entry: T): Promise<T | null> {
    let plan: DynamicQuery = this.query.save(<T>entry);
    return await this.queryTemplate.save(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async insert(entry: T): Promise<boolean> {
    let plan: DynamicQuery = this.query.save(<T>entry);
    return await this.queryTemplate.insert(plan.getText(), plan.getValues());
  }

  public async persist(entry: T): Promise<T | null> {
    let plan: DynamicQuery = this.query.insert(<T>entry);
    return await this.queryTemplate.persist(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async updateOne(id: string | number, userId?: number): Promise<T | null> {
    let plan: DynamicQuery = this.query.updateOne(id, userId);
    return await this.queryTemplate.updateOne(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async update(id: string | number, entry: T, userId?: number): Promise<T | null> {
    let plan: DynamicQuery = this.query.update(id, <T>entry, userId);
    return await this.queryTemplate.update(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async deleteOne(id: string | number, userId?: number): Promise<T | null> {
    let plan: DynamicQuery = this.query.deleteOne(id, userId);
    return await this.queryTemplate.deleteOne(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async remove(id: string | number, userId?: number): Promise<T | null> {
    let plan: DynamicQuery = this.query.remove(id, userId);
    return await this.queryTemplate.delete(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async deleteMany(entries: string): Promise<T[]> {
    let plan: DynamicQuery = this.query.deleteMany(entries);
    return await this.queryTemplate.deleteMany(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async deleteAll(): Promise<T[]> {
    let plan: DynamicQuery = this.query.deleteAll();
    return await this.queryTemplate.deleteAll(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async findAndDeleteAll(): Promise<T[]> {
    let plan: DynamicQuery = this.query.findAndDeleteAll();
    return await this.queryTemplate.findAndDeleteAll(plan.getText(), plan.getValues(), this.VxEntity);
  }

  public async relatedEntities(entry: T): Promise<T | null> { return null; }

  public getQueryTemplate(): QueryTemplate<T> { return this.queryTemplate; }

  public getClient(): QueryClient {
    if (this.client !== null) { return this.client }
    else { return new QueryClientImpl(); }
  }

  public setClient(client: QueryClient | null): void {
    this.client = client;
  }

  public getTransactionManager(): null { return null; }

  public setTransactionManager(manager: null): void { }

  public getOrmClient(): QueryClient { return new QueryClientImpl(); }

}