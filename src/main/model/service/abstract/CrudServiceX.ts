import { CrudService } from './Service';

export interface CrudServiceX<T extends Object> extends CrudService<T> {

  deleteMany(entries: string | string[]): Promise<T[]>;
  deleteAll(): Promise<T[]>;
  updateOne(id: string | number, userId?: number): Promise<T | null>;
  relatedEntities(entry: T): Promise<T | null>;
  addOne(): Promise<T>;
  deleteOne(id: string | number, userId?: number): Promise<T | null>;
  findAndDeleteAll(): Promise<T[]>;
  selectOnlyNameAndId(): Promise<T[]>;
}