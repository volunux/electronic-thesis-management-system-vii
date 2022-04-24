import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class HomeRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() {}

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Account' , this.search_criteria);
  }

}