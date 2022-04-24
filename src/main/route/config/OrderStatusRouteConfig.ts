import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class OrderStatusRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [
    new RouteSearchCriteria('name' , 'Name')];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Order Status' , this.search_criteria); }
}