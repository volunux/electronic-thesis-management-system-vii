export class SearchQueryConditionOptions {

  private conds : Map<string , string> = new Map<string , string>();

  public add(key : string , item : string) : void { this.conds.set(key , item); }

  public buildResult() : string { let builder : string = "";
    this.conds.forEach((item : string , key : string) => { builder += item; });
    return builder; }

}