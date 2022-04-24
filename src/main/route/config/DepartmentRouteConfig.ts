import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class DepartmentRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('name' , 'Name') ,
    new RouteSearchCriteria('abbreviation' , 'Abbreviation')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Department' , this.search_criteria);
  }

}