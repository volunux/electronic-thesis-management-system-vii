import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class LevelRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('name' , 'Name') ,
    new RouteSearchCriteria('abbreviation' , 'Abbreviation')];

  private constructor() {}

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Level' , this.search_criteria);
  }

}