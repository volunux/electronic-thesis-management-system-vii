export class SearchQueryJoinOptions {

  private joins : Map<string , string> = new Map<string , string>();

  public add(key : string , item : string) : void { this.joins.set(key , item); }

  public buildResult() : string { let builder : string = "";
    this.joins.forEach((item : string , key : string) => { builder += item; });

    return builder; }
}