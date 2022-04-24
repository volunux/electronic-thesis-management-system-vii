import { VxEntityOneRepositoryImpl } from '../abstract/VxEntityOneRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { CountryRepository } from '../CountryRepository';
import { Country } from '../../../entity/Country';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class CountryRepositoryImpl extends VxEntityOneRepositoryImpl<Country> implements CountryRepository {

  protected readonly search: AbbreviationEntitySearch<Country> = AbbreviationEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<Country> = Country;

}