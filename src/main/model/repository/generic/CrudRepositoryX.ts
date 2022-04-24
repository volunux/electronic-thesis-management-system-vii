import { CrudRepository } from './Repository';

export interface CrudRepositoryX<T> extends CrudRepository<T> {

  saveMany(entries: T[]): Promise<boolean>;
  deleteMany(entries: string | string[]): Promise<T[]>;
  deleteAll(): Promise<T[]>;
  updateOne(id: string | number, userId?: number): Promise<T | null>;
  relatedEntities(entry: T): Promise<T | null>;
  addOne(): Promise<T>;
  deleteOne(id: string | number, userId?: number): Promise<T | null>;
  findAndDeleteAll(): Promise<T[]>;
  selectOnlyNameAndId(): Promise<T[]>;
}