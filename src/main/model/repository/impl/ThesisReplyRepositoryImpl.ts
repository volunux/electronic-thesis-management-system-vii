import { getRepository , SelectQueryBuilder } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { DefaultEntitySearch } from '../../../helper/search/impl/DefaultEntitySearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisReplyRepository } from '../ThesisReplyRepository';
import { ThesisReply } from '../../../entity/ThesisReply';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisReplyRepositoryImpl extends AbstractBaseOrmRepositoryImpl<ThesisReply> implements ThesisReplyRepository {

  protected readonly search : DefaultEntitySearch<ThesisReply> = DefaultEntitySearch.getInstance({});
  protected readonly VxEntity : Newable<ThesisReply> = ThesisReply;

  public async findOne(id : string | number , userId? : number) : Promise<ThesisReply | null> {
    let entry : ThesisReply | undefined = await getRepository(this.VxEntity).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.comment` , `cm`)
    .where({'_id' : id}).select([`vx` , `cm.text` , `cm.thesis_title`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async findAll(q : EntityQueryConfig) : Promise<ThesisReply[]> {
    let qb : SelectQueryBuilder<ThesisReply> = await this.findAllInternal(q);
    return await qb.select([`vx._id` , `vx.author_name` , `vx.updated_on` , `vx.created_on`]).orderBy(`vx.updated_on` , `ASC`).addOrderBy(`vx._id` , `ASC`).limit(10).getMany();
  } 

  public async findReplyIdsByCommentId(id : string | number) : Promise<ThesisReply[]> { 
    return await getRepository(ThesisReply).find({'where' : {'comment_id' : id} , 'select' : ['_id']} as any); }

}