import { EntityQueryConfig } from '../util/EntityQueryConfig';
import { DynamicQuery } from '../util/DynamicQuery';

export interface AbstractBaseQuery<T> {

  findOne(id : number | string , user_id? : number) : DynamicQuery;
  findMany(entries : string) : DynamicQuery;
  selectOnlyNameAndId() : DynamicQuery;
  findAll(q : EntityQueryConfig) : DynamicQuery;
  save(entry : T) : DynamicQuery;
  insert(entry : T) : DynamicQuery;
  relatedEntities() : DynamicQuery;
  update(id : number | string , entry : T , user_id? : number) : DynamicQuery;  
  deleteOne(id : number | string , user_id? : number) : DynamicQuery;
  remove(id : number | string , user_id? : number) : DynamicQuery;
  deleteMany(entries : string) : DynamicQuery;
  deleteAll() : DynamicQuery;
  findAndDeleteAll() : DynamicQuery;
  existsOne(id : number | string) : DynamicQuery;
  updateOne(id : number | string , user_id? : number) : DynamicQuery;
}