import { getRepository, SelectQueryBuilder } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisCommentRepository } from '../ThesisCommentRepository';
import { ThesisComment } from '../../../entity/ThesisComment';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisCommentRepositoryImpl extends AbstractBaseOrmRepositoryImpl<ThesisComment> implements ThesisCommentRepository {

  protected readonly search: DefaultEntitySearch<ThesisComment> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<ThesisComment> = ThesisComment;

  public async findAll(q: EntityQueryConfig): Promise<ThesisComment[]> {
    let qb: SelectQueryBuilder<ThesisComment> = await this.findAllInternal(q);
    return await qb.select([`vx._id`, `vx.author_name`, `vx.thesis_title`, `vx.updated_on`, `vx.created_on`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`).limit(10).getMany();
  }

  public async findCommentIdsByThesisId(id: string | number): Promise<ThesisComment[]> {
    return await getRepository(ThesisComment).find({ 'where': { 'thesis_id': id }, 'select': ['_id'] } as any);
  }

}