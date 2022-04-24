import { AbstractBaseEntitySearch } from '../abstract/AbstractBaseEntitySearch';

export class DefaultEntitySearch<T> extends AbstractBaseEntitySearch<T> { 

  public static getInstance(data : any) : DefaultEntitySearch<any> { return new DefaultEntitySearch(); }
}