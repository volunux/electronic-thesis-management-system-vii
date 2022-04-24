import { SelectQueryBuilder, Like } from 'typeorm';
import { EntityQueryConfig } from '../../../model/query/util/EntityQueryConfig';
import { SearchQueryOptions } from '../common/SearchQueryOptions';

export abstract class AbstractBaseEntitySearch<T> {

  protected searchQueryOptions: SearchQueryOptions = SearchQueryOptions.getInstance();
  protected updatedOnAlias: string = 'updated_on';
  protected nameAlias: string = 'name';

  constructor() { }

  public addQ(key: string, item: string) { this.searchQueryOptions.getSearchQueryConditionOptions().add(key, item); }

  public minDate(qb: SelectQueryBuilder<T>, eqc: EntityQueryConfig): void {
    let updatedMin: string = (<string>eqc.getParameter('updated_min'));
    updatedMin = updatedMin.replace(" 00", "+00");
    let id: number = +(<string>eqc.getParameter('entry_id'));
    updatedMin = updatedMin.replace(" 00", "+00");
    let p: number = +(<string>eqc.getParameter(`page`));
    let minId: number = id - 10;
    if (p === 1) { }
    else { qb.andWhere(`vx.updated_on < :updated_on OR (vx.updated_on = :updated_on AND vx._id > :id)`, { 'updated_on': updatedMin, 'id': minId }); }
  }

  public maxDate(qb: SelectQueryBuilder<T>, eqc: EntityQueryConfig): void {
    let updatedMax: string = (<string>eqc.getParameter('updated_max'));
    let id: string = (<string>eqc.getParameter('entry_id'));
    updatedMax = updatedMax.replace(" 00", "+00");
    qb.andWhere(`vx.updated_on > :updated_on OR (vx.updated_on = :updated_on AND vx._id > :id)`, { 'updated_on': updatedMax, 'id': +id });
  }

  public label(qb: SelectQueryBuilder<T>, eqc: EntityQueryConfig): void {
    let name: string = (<string>eqc.getParameter('search'));
    qb.where({ 'name': Like(`%${name}%`) });
  }

  public word(qb: SelectQueryBuilder<T>, eqc: EntityQueryConfig): void {
    let word: string = (<string>eqc.getParameter('search'));
    qb.where({ 'word': Like(`%${word}%`) });
  }
}