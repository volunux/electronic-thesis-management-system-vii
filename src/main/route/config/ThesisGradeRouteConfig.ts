import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ThesisGradeRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [new RouteSearchCriteria('name' , 'Name')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Thesis Grade' , this.search_criteria); }

}