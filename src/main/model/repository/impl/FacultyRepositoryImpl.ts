import { VxEntityOneRepositoryImpl } from '../abstract/VxEntityOneRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { FacultyRepository } from '../FacultyRepository';
import { Faculty } from '../../../entity/Faculty';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class FacultyRepositoryImpl extends VxEntityOneRepositoryImpl<Faculty> implements FacultyRepository {

  protected readonly search: AbbreviationEntitySearch<Faculty> = AbbreviationEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<Faculty> = Faculty;

}