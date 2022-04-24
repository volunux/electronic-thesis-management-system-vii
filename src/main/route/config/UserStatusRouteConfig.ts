import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class UserStatusRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('name' , 'Name')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('User Status' , this.search_criteria); }

}