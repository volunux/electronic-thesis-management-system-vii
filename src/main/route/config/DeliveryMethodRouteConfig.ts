import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class DeliveryMethodRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [ new RouteSearchCriteria('name' , 'Name')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig {
    return new RouteOptionsConfig('Delivery Method' , this.search_criteria);
  }

}