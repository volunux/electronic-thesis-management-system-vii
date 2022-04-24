import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class UserRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('status' , 'Status') ,
    new RouteSearchCriteria('email_address' , 'Email Address') ,
    new RouteSearchCriteria('matriculation_number' , 'Matriculation Number')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('User' , this.search_criteria); }

}