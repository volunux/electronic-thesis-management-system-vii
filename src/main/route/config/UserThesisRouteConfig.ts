import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class UserThesisRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('title' , 'Title') ,
    new RouteSearchCriteria('status' , 'Status') ,
    new RouteSearchCriteria('publication_year' , 'Publication Year')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Thesis' , this.search_criteria);
  }

}