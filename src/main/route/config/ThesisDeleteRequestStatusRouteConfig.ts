import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ThesisDeleteRequestStatusRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('name' , 'Name')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Thesis Delete Request Status' , this.search_criteria); }

}