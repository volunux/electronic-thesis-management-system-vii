import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class GeneralThesisRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('title' , 'Title') ,
    new RouteSearchCriteria('department' , 'Department') ,
    new RouteSearchCriteria('faculty' , 'Faculty') ,
    new RouteSearchCriteria('publication_year' , 'Publication Year') ,
    new RouteSearchCriteria('author' , 'Author')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Thesis' , this.search_criteria);
  }

}