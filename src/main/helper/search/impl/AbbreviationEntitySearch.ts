import { SelectQueryBuilder , Like } from 'typeorm';
import { EntityQueryConfig } from '../../../model/query/util/EntityQueryConfig';
import { AbstractBaseEntitySearch } from '../abstract/AbstractBaseEntitySearch';

export class AbbreviationEntitySearch<T> extends AbstractBaseEntitySearch<T> { 

  public abbreviation(qb : SelectQueryBuilder<T> , eqc : EntityQueryConfig) : void { let abbreviation : string = (<string>eqc.getParameter('search'));
   abbreviation = abbreviation.toUpperCase().split(' ').join('');
    qb.where({'abbreviation' : Like(`%${abbreviation}%`)}); }

  public static getInstance(data : any) : AbbreviationEntitySearch<any> { return new AbbreviationEntitySearch(); }
}