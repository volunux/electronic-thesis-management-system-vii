import { QueryResultRow } from 'pg';

export interface RowMapper<T> {
  process(rowsData : QueryResultRow[]) : T[];
}