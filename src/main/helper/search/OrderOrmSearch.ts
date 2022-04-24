import { SelectQueryBuilder , Equal , Like } from 'typeorm';
import { SearchQueryOptions } from './common/SearchQueryOptions';
import { AbstractStatusEntitySearch } from './abstract/AbstractStatusEntitySearch';
import { EntityQueryConfig } from '../../model/query/util/EntityQueryConfig';
import { Order } from '../../entity/Order';

export class OrderOrmSearch extends AbstractStatusEntitySearch<any> {

  public reference(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let reference : string = (<string>eqc.getParameter('search'));
    qb.andWhere({'order_reference' : Equal(reference)}); }

  public amount(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let amount : number = Number.parseInt((<string>eqc.getParameter('search')));
   if (amount) qb.andWhere({'amount' : Equal(amount)}); }

  public quantity(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let quantity : number = Number.parseInt((<string>eqc.getParameter('search')));
    if(quantity) qb.andWhere({'quantity' : Equal(quantity)}); }

    public static getInstance() : OrderOrmSearch { return new OrderOrmSearch(); }
}