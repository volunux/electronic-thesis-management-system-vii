import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { ObjectSweepRepository } from '../../repository/ObjectSweepRepository';
import { ObjectSweepRepositoryImpl } from '../../repository/impl/ObjectSweepRepositoryImpl';
import { ObjectSweep } from '../../../entity/ObjectSweep';

export class ObjectSweepServiceImpl extends AbstractBaseServiceImpl<ObjectSweep> {

  protected readonly repository : ObjectSweepRepository = new ObjectSweepRepositoryImpl();

  public async saveMany(entries : ObjectSweep[]) : Promise<boolean> { return this.repository.saveMany(entries); }
}
