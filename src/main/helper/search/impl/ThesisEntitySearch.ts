import { SelectQueryBuilder , Equal , Like , ILike } from 'typeorm';
import { AbstractStatusEntitySearch } from '../abstract/AbstractStatusEntitySearch';
import { EntityQueryConfig } from '../../../model/query/util/EntityQueryConfig';

export class ThesisEntitySearch extends AbstractStatusEntitySearch<any> {

  public title(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let title : string = (<string>eqc.getParameter('search'));
    qb.andWhere({'title' : ILike(`%${title}%`)}); }

  public authorName(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let authorName : string = (<string>eqc.getParameter('search'));
    qb.andWhere({'author_name' : Like(`%${authorName}%`)}); }

  public publicationYear(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let publicationYear : string = (<string>eqc.getParameter('search'));
    qb.andWhere({'publication_year' : Equal(publicationYear)}); }

  public department(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let department : string = (<string>eqc.getParameter('search'));
    department = department.split(' ').map((s : string) => { if (s === 'And' || s === 'and' || s === 'AND') return 'and';
      if (s) return s[0].toUpperCase() + s.slice(1).toLowerCase(); }).join(' ');
    qb.andWhere({'department' : {'name' : Like(`%${department}%`)}}); }

  public faculty(qb : SelectQueryBuilder<any> , eqc : EntityQueryConfig) : void { let faculty : string = (<string>eqc.getParameter('search'));
    faculty = faculty.split(' ').map((s : string) => { if (s === 'And' || s === 'and' || s === 'AND') return 'and';
      if (s) return s[0].toUpperCase() + s.slice(1).toLowerCase(); }).join(' ');
    qb.andWhere({'faculty' : {'name' : Like(`%${faculty}%`)}}); }

    public static getInstance() : ThesisEntitySearch { return new ThesisEntitySearch(); }

}