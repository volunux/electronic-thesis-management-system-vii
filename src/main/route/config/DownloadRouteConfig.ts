import { RouteOptionsConfig } from './RouteOptionsConfig';
import { RouteSearchCriteria } from './RouteSearchCriteria';

export class DownloadRouteConfig {

  public static search_criteria : RouteSearchCriteria[] = [];

  private constructor() {}

  public static getInstance() : RouteOptionsConfig { return new RouteOptionsConfig('Download' , this.search_criteria); }
}