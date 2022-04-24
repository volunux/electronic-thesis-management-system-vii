import { EntityQueryConfig } from '../util/EntityQueryConfig';
import { AbstractBaseQuery } from '../interface/AbstractBaseQuery';
import { DynamicQuery } from '../util/DynamicQuery';

export abstract class AbstractBaseQueryImpl<T> implements AbstractBaseQuery<T> {

  public findOne(id : number | string) : DynamicQuery { return DynamicQuery.empty(); }
  public selectOnlyNameAndId() : DynamicQuery { return DynamicQuery.empty(); }
  public findAll(q : EntityQueryConfig) : DynamicQuery { return DynamicQuery.empty(); }
  public findMany(entries : string) : DynamicQuery { return DynamicQuery.empty(); }
  public save(entry : T) : DynamicQuery { return DynamicQuery.empty(); }
  public insert(entry : T) : DynamicQuery { return DynamicQuery.empty(); }
  public saveMany(entry : T) : DynamicQuery { return DynamicQuery.empty(); }
  public relatedEntities() : DynamicQuery { return DynamicQuery.empty(); }
  public update(id : number | string , entry : T) : DynamicQuery { return DynamicQuery.empty(); } 
  public deleteOne(id : number | string) : DynamicQuery { return DynamicQuery.empty();  }
  public remove(id : number | string) : DynamicQuery { return DynamicQuery.empty(); }
  public deleteMany(entries : string) : DynamicQuery { return DynamicQuery.empty(); }
  public deleteAll() : DynamicQuery { return DynamicQuery.empty(); }
  public findAndDeleteAll() : DynamicQuery { return DynamicQuery.empty(); }
  public existsOne(id : number | string) : DynamicQuery { return DynamicQuery.empty(); }
  public updateOne(id : number | string) : DynamicQuery { return DynamicQuery.empty(); }
}