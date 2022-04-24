import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { CountryRepository } from '../../repository/CountryRepository';
import { CountryRepositoryImpl } from '../../repository/impl/CountryRepositoryImpl';
import { Country } from '../../../entity/Country';

export class CountryServiceImpl extends AbstractBaseServiceImpl<Country> {

  protected readonly repository : CountryRepository = new CountryRepositoryImpl();
}
