import { RouteSearchCriteria } from './RouteSearchCriteria';

export class RouteOptionsConfig {

  constructor(title : string , search_criteria? : RouteSearchCriteria[]) {

    this.title = title;
    this.search_criteria = search_criteria ? search_criteria : [];
  }

  private title : string;
  private baseUrl : string;
  private search_criteria : RouteSearchCriteria[];

  public getTitle() : string {
    return this.title;
  }

  public getRouteSearchCriteria() : RouteSearchCriteria[] {
    return this.search_criteria;
  }

  public getBaseUrl() : string {
    return this.baseUrl;
  }

  public static empty() : RouteOptionsConfig {
    return new RouteOptionsConfig("" , []);
  }

}