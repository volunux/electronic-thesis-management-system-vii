import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class LoggerRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Log' , this.search_criteria); }
}