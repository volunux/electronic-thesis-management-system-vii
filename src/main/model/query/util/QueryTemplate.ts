import DataSource from './DataSource';
import Query from './Query';
import { Newable } from '../../../entity/interface/Newable';
import { RowMapper } from '../../mapper/RowMapper';

export interface QueryTemplate<T extends Object> {

    findOne(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    findId(text: string, params: any[], idKey: string): Promise<number>;
    executePlain(text: string, params: any[]): Promise<Object | null>;
    executePlainList(text: string, params: any[]): Promise<Object[]>;
    executeTyped(text: string, params: any[], VxEntity: Newable<T>): Promise<T | null>;
    existsOne(text: string, params: any[]): Promise<boolean>;
    entryExists(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    execute(text: string, params: any[]): Promise<boolean>;
    findAll(text: string, params: any[], entity: Newable<T>): Promise<T[]>;
    findAllAndSetWithRowMapper(text: string, params: any[], rowMapper: RowMapper<T>): Promise<T[]>;
    save(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    insert(text: string, params: any[]): Promise<boolean>;
    persist(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    updateOne(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    update(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    updateAndReturnBool(text: string, params: any[]): Promise<boolean>;
    updateOrThrow(text: string, params: any[]): Promise<boolean>;
    deleteOne(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    delete(text: string, params: any[], entity: Newable<T>): Promise<T | null>;
    deleteMany(text: string, params: any[], entity: Newable<T>): Promise<T[]>;
    deleteAll(text: string, params: any[], VxEntity: Newable<T>): Promise<T[]>;
    findAndDeleteAll(text: string, params: any[], VxEntity: Newable<T>): Promise<T[]>;
    relatedEntities(text: string, params: any[]): Promise<Object | null>;
    getDataSource(): Query;
    bindSource(dataSource: DataSource): void;
}