import { SelectQueryBuilder, getRepository, createQueryBuilder } from 'typeorm';
import { AbstractBaseOrmThesisRepositoryImpl } from '../abstract/AbstractBaseOrmThesisRepositoryImpl';
import { Newable } from '../../../entity/interface/Newable';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { GeneralThesisRepository } from '../../repository/GeneralThesisRepository';
import { Thesis } from '../../../entity/Thesis';
import { ThesisComment } from '../../../entity/ThesisComment';
import { ThesisReply } from '../../../entity/ThesisReply';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class GeneralThesisRepositoryImpl extends AbstractBaseOrmThesisRepositoryImpl implements GeneralThesisRepository {

  protected readonly VxEntity: Newable<Thesis> = Thesis;
  protected readonly query: any = null;

  public async findAll(q: EntityQueryConfig): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await getRepository(Thesis).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.department`, `dt`).leftJoin(`vx.faculty`, `ft`);
    if (q !== null && q !== undefined) {
      if (q.getParameter(`type`) === `status`) { this.search.status(qb, q); }
      else if (q.getParameter(`type`) === `title`) { this.search.title(qb, q); }
      else if (q.getParameter(`type`) === `publication_year`) { this.search.publicationYear(qb, q); }
      else if (q.getParameter(`type`) === `author`) { this.search.authorName(qb, q); }
      else if (q.getParameter(`type`) === `department`) { this.search.department(qb, q); }
      else if (q.getParameter(`type`) === `faculty`) { this.search.faculty(qb, q); }
      else if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }

    return await qb.select([`vx._id`, `vx.title`, `vx.publication_year`, `vx.price`, `vx.updated_on`, `vx.author_name`, `vx.slug`, `dt.name`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`)
      .limit(10).getMany();
  }

  public async findRelatedEntries(id: number): Promise<Thesis[]> {
    let qb: SelectQueryBuilder<Thesis> = await createQueryBuilder(Thesis, `vx`).leftJoinAndSelect(`thesis`, `rth`, `rth._id = :id`, { 'id': id }).leftJoinAndSelect(`vx.department`, `dt`);
    qb.where(`(vx._id != :id) AND (vx.department_id = rth.department_id OR vx.department_id != rth.department_id)`, { 'id': id })
      .select([`vx._id`, `vx.title`, `vx.publication_year`, `vx.price`, `vx.number_of_page`, `vx.author_name`, `vx.slug`, `dt.name`]).limit(6);
    return await qb.getMany();
  }

  public async findDiscussion(id: number): Promise<ThesisComment[]> {
    return await getRepository(ThesisComment).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.replies`, `replies`).where({ 'thesis_id': id }).getMany();
  }

  public async saveComment(entry: ThesisComment, thesis: Thesis): Promise<boolean> {
    entry = await getRepository(ThesisComment).save(entry);
    if (entry === undefined) return false;
    return true;
  }

  public async saveReply(entry: ThesisReply, comment: ThesisComment): Promise<boolean> {
    entry = await getRepository(ThesisReply).save(entry);
    if (entry === undefined) return false;
    return true;
  }

  public async existsComment(id: number): Promise<boolean> {
    let entry: ThesisComment | undefined;
    entry = await getRepository(ThesisComment).findOne(id, { 'select': [`_id`] } as any);
    if (entry === undefined) return false;
    return true;
  }

  public async existsCommentEntry(id: number): Promise<boolean> {
    let entry: Thesis | undefined;
    entry = await getRepository(Thesis).findOne(id, { 'select': [`_id`] } as any);
    if (entry === undefined) return false;
    return true;
  }
}