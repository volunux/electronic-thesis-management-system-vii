import { CrudServiceX } from './abstract/CrudServiceX';
import { Country } from '../../entity/Country';

export interface CountryService extends CrudServiceX<Country> { }