import { SelectQueryBuilder } from 'typeorm';

export interface QueryBuilderHolder<T> {
  [key: string]: SelectQueryBuilder<T> | null;
}