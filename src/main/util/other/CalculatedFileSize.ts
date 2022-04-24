export default class CalculatedFileSize {

  private totalFileSize : number;
  private calculatedSize : string;
  private fileSizeUnit : string[];

  constructor(data? : any) {
    if (data) {
      this.totalFileSize = data.totalFileSize ? data.totalFileSize : 1024;
      this.calculatedSize = data.calculatedSize ? data.calculatedSize : "0";
      this.fileSizeUnit = data.fileSizeUnit ? data.fileSizeUnit : [];
    }
  }

  public getTotalFileSize() : number {
    return this.totalFileSize;
  }

  public getCalculatedSize() : string {
    return this.calculatedSize;
  }

  public getFileSizeUnit() : string[] {
    return this.fileSizeUnit;
  }

}