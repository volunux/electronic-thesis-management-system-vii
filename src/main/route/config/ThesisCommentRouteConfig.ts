import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class ThesisCommentRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() { }

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Thesis Comment' , this.search_criteria); }
}