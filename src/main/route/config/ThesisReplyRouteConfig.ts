import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ThesisReplyRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() {}

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Thesis Reply' , this.search_criteria); }
}