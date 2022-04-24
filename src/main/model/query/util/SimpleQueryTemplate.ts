import { QueryResult , QueryResultRow } from 'pg';
import { Logger } from 'winston';
import SimpleLogger from '../../../util/other/Logger';
import Query from './Query';
import DataSource from '../../query/util/DataSource';
import { RowMapper } from '../../mapper/RowMapper';
import { QueryTemplate } from './QueryTemplate';
import { DataAccessException } from '../../../entity/error/DataAccessException';
import { Newable } from '../../../entity/interface/Newable';
import { ServiceHelper } from '../../util/ServiceHelper';

export class SimpleQueryTemplate<T> implements QueryTemplate<T> {

  protected dataSource : Query;
  private readonly logger : Logger = SimpleLogger.getLogger().child({'component' : SimpleQueryTemplate.name});

  constructor(dataSource : Query) {
    this.dataSource = dataSource; 
  }

  public async findOne(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async entryExists(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async findId(text : string , params : any[] , idKey : string) : Promise<number> {
    let entryId : number = 0;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entryId = Number.parseInt(singleResult[idKey]); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entryId;
  } 

  public async executeTyped(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async executePlain(text : string , params : any[]) : Promise<Object | null> {
    let entry : Object | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = singleResult; } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async executePlainList(text : string , params : any[]) : Promise<Object[]> {
    let entry : Object[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entry = <QueryResultRow[]>listResult; } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async execute(text : string , params : any[]) : Promise<boolean> {
    let executed : boolean = false;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        executed = true; } }
    catch(err : any) { throw new DataAccessException(err); }

    return executed;
  }

  public async existsOne(text : string , params : any[]) : Promise<boolean> {
    let exists : boolean = false;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        exists = true; } }
    catch(err : any) { throw new DataAccessException(err); }

    return exists;
  }

  public async findAll(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T[]> {
    let entries : T[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entries = ServiceHelper.rowsToObjectMapper<T>(listResult , VxEntity); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entries;
  } 

  public async findAllAndSetWithRowMapper(text : string , params : any[] , rowMapper : RowMapper<T>) : Promise<T[]> {
    let entries : T[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entries = rowMapper.process(listResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entries;
  } 

  public async save(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public async insert(text : string , params : any[]) : Promise<boolean> {
    let saved : boolean = false;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if (result.rowCount > 0) { saved = true; } }
    catch(err : any) { throw new DataAccessException(err); }

    return saved;
  }

  public async persist(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public async updateOne(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public async update(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public async updateAndReturnBool(text : string , params : any[]) : Promise<boolean> {
    let updated : boolean = false;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if (result.rowCount > 0) { updated = true; } }
    catch(err : any) { throw new DataAccessException(err); }

    return updated;
  }

  public async updateOrThrow(text : string , params : any[]) : Promise<boolean> {
    let updated : boolean = false;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if (result.rowCount > 0) { updated = true; } }
    catch(err : any) { throw new DataAccessException(err); }

    return updated;
  }

  public async deleteOne(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  } 

  public async delete(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T | null> {
    let entry : T | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let singleResult : QueryResultRow = result.rows[0];
        entry = new VxEntity(singleResult); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public async deleteMany(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T[]> {
    let entries : T[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entries = ServiceHelper.rowsToObjectMapper<T>(listResult , VxEntity); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entries;
  }

  public async deleteAll(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T[]> {
    let entries : T[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entries = ServiceHelper.rowsToObjectMapper<T>(listResult , VxEntity); } }
    catch(err : any) { throw new DataAccessException(err); }

    return entries;
  }

  public async findAndDeleteAll(text : string , params : any[] , VxEntity : Newable<T>) : Promise<T[]> {
    let entries : T[] = [];
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { let listResult : QueryResultRow[] = result.rows;
        entries = ServiceHelper.rowsToObjectMapper<T>(listResult , VxEntity); } } 
    catch(err : any) { throw new DataAccessException(err); }

    return entries;
  }

  public async relatedEntities(text : string , params : any[]) : Promise<Object | null> {
    let entry : Object | null = null;
    try { let result : QueryResult = await this.dataSource.execute(text , params);
      if ((<QueryResultRow[]>result.rows).length > 0) { entry = (<QueryResultRow>result.rows[0]).result; } }
    catch(err : any) { throw new DataAccessException(err); }

    return entry;
  }

  public getDataSource() : DataSource { return this.dataSource; }

  public bindSource(dataSource : DataSource) : void { this.dataSource = dataSource; }

}