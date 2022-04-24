import { EntityManager, getRepository, InsertResult, DeleteResult, ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { ObjectSweepRepository } from '../ObjectSweepRepository';
import { ObjectSweep } from '../../../entity/ObjectSweep';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ObjectSweepRepositoryImpl extends AbstractBaseOrmRepositoryImpl<ObjectSweep> implements ObjectSweepRepository {

  protected readonly VxEntity: Newable<ObjectSweep> = ObjectSweep;
  protected readonly search: any = null;

  public async findAll(q: EntityQueryConfig): Promise<ObjectSweep[]> { return getRepository(ObjectSweep).createQueryBuilder(`vx`).select([`vx`]).limit(10).getMany(); }

  public async saveMany(entries: ObjectSweep[]): Promise<boolean> {
    let manager: EntityManager | null = await this.getTransactionManager();
    let result: InsertResult = manager !== null ? await manager!.getRepository(ObjectSweep).createQueryBuilder(`vx`).insert().values(entries).execute() :
      await getRepository(ObjectSweep).createQueryBuilder(`vx`).insert().values(entries).execute();

    let objs: ObjectLiteral = result.identifiers;
    let newEntries: ObjectSweep[] = [];
    if (objs.length > 0) { objs.forEach((entry: any): number => newEntries.push(new ObjectSweep(entry))); }
    else { []; }
    return true;
  }

  public async remove(id: string | number): Promise<ObjectSweep | null> {
    let entry: ObjectSweep | null = null;
    let result: DeleteResult = await getRepository(ObjectSweep).createQueryBuilder(`vx`).delete().where({ '_id': id }).returning(`_id`).execute();
    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { entry = new ObjectSweep(result.raw[0]); }
    }
    return entry;
  }

}