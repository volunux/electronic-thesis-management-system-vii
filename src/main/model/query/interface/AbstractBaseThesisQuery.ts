import { DynamicQuery } from '../util/DynamicQuery';
import { AbstractBaseQuery } from './AbstractBaseQuery';

export interface AbstractBaseThesisQuery<T> extends AbstractBaseQuery<T> {

  setThesisStatusPending(id : string) : DynamicQuery;
  updateStatus(slug : string , status : string) : DynamicQuery;
}