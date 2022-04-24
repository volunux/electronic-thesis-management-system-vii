import { BaseEntityController } from './abstract/BaseEntityController';
import { Newable } from '../entity/interface/Newable';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { CountryServiceImpl } from '../model/service/impl/CountryServiceImpl';
import { CountryService } from '../model/service/CountryService';
import { Country } from '../entity/Country';

export class CountryController extends BaseEntityController<Country> {

  protected service: CountryService = new CountryServiceImpl();
  protected VxEntity: Newable<Country> = Country;

  constructor(config: RouteOptionsConfig) { super(config, Country); }

  protected backToEntries(): string { return "/internal/country/entries/"; }

  protected backToHome(): string { return "/internal/country/"; }

  protected getBaseViewPath(): string { return "pages/shared/one/"; }

}