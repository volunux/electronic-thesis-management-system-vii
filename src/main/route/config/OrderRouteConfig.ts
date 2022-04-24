import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class OrderRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('amount' , 'Amount') ,
    new RouteSearchCriteria('reference' , 'Reference No. or String'),
    new RouteSearchCriteria('quantity' , 'Quantity')];

  private constructor() {}

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Order' , this.search_criteria);
  }

}