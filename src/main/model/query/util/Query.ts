import { QueryResult } from 'pg';

export default interface Query {

  execute(text: string, params: string[]): Promise<QueryResult | any>;
  getOriginalDataSource(): Query;
}