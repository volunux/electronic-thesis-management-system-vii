import { VxEntityOneRepositoryImpl } from '../abstract/VxEntityOneRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { LevelRepository } from '../LevelRepository';
import { Level } from '../../../entity/Level';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class LevelRepositoryImpl extends VxEntityOneRepositoryImpl<Level> implements LevelRepository {

  protected readonly search : AbbreviationEntitySearch<Level> = AbbreviationEntitySearch.getInstance({});
  protected readonly VxEntity : Newable<Level> = Level;

}