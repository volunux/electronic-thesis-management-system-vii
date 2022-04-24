export interface Newable<T extends Object> {

  new(...data: any[]): T;
}