import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { LevelRepository } from '../../repository/LevelRepository';
import { LevelRepositoryImpl } from '../../repository/impl/LevelRepositoryImpl';
import { Level } from '../../../entity/Level';

export class LevelServiceImpl extends AbstractBaseServiceImpl<Level> {

  protected readonly repository : LevelRepository = new LevelRepositoryImpl();
}
