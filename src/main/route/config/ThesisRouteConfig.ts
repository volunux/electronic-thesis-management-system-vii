import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ThesisRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('title' , 'Title') ,
    new RouteSearchCriteria('publication_year' , 'Publication Year') ,
    new RouteSearchCriteria('status' , 'Status'),
    new RouteSearchCriteria('department' , 'Department')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Thesis' , this.search_criteria );
  }

}