import { Newable } from '../../entity/interface/Newable';

export class ServiceHelper {

  public static deleteMany(entries: string[]): string | string[] {
    let entriesTransformed: string | string[] = entries.map((item: string) => { return `${item}`; }).join(' , ');
    return entriesTransformed;
  }

  public static rowsToObjectMapper<T extends Object>(rowsData: any[], VxEntity: Newable<T>): T[] {
    let entries: T[] = [];
    if (rowsData != null) {
      rowsData.forEach((record: any) => {
        let entry = new VxEntity(record);
        entries.push(entry);
      });
    }
    return entries;
  }
}