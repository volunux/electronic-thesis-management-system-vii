export class DynamicQuery {

  private text: string = "";
  private values: any[] = [];

  constructor(text: string, values: any[]) {

    this.text = text;
    this.values = values;
  }

  public static create(text: string, values: any[]): DynamicQuery {
    if (values != null && values.length > 0) {
      values = values.map((parameter: any) => {
        if (parameter == undefined) return null;
        return parameter;
      });
      return new DynamicQuery(text, values);
    }
    else { return new DynamicQuery(text, []); }
  }

  public static empty(): DynamicQuery { return new DynamicQuery("", []); }

  public getText(): string { return this.text; }

  public getValues(): any[] { return this.values; }
}