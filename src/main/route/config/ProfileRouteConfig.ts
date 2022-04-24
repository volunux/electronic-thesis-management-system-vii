import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ProfileRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('User' , this.search_criteria);
  }

}