import { getRepository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { Newable } from '../../../entity/interface/Newable';
import { ThesisDeleteRequestRepository } from '../ThesisDeleteRequestRepository';
import { ThesisDeleteRequest } from '../../../entity/ThesisDeleteRequest';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class ThesisDeleteRequestRepositoryImpl extends AbstractBaseOrmRepositoryImpl<ThesisDeleteRequest> implements ThesisDeleteRequestRepository {

  protected readonly search: AbbreviationEntitySearch<ThesisDeleteRequest> = AbbreviationEntitySearch.getInstance({});
  protected readonly VxEntity: Newable<ThesisDeleteRequest> = ThesisDeleteRequest;

  public async findOne(id: string | number, userId?: number): Promise<ThesisDeleteRequest | null> {
    let entry: ThesisDeleteRequest | undefined = await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.requester`, `rq`).leftJoinAndSelect(`vx.handler`, `hd`)
      .leftJoinAndSelect(`vx.thesis`, `th`).leftJoinAndSelect(`vx.status`, `st`).where({ '_id': id })
      .select([`vx._id`, `vx.created_on`, `vx.updated_on`, `vx.response`, `vx.message`, `vx.thesis_id`, `th.title`, `rq._id`, `rq.first_name`, `rq.last_name`, `rq.email_address`,
        `hd.first_name`, `hd.last_name`, `st.name`]).limit(1).getOne();

    if (entry === undefined) return null;
    return entry;
  }

  public async update(id: string | number, entry: ThesisDeleteRequest): Promise<ThesisDeleteRequest | null> {
    let updatedEntry: ThesisDeleteRequest | null = null;
    let result: UpdateResult = await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`).update(ThesisDeleteRequest).set({
      'status_id': entry.getStatusId(), 'handler_id': entry.getHandlerId(),
      'response': entry.getResponse(), 'updated_on': entry.getUpdatedOn()
    } as any).where({ '_id': id }).returning([`_id`]).execute();

    if (result !== null && result.affected !== undefined && result.affected !== null) {
      if (result.affected > 0) { updatedEntry = new ThesisDeleteRequest(result.raw[0]); }
    }
    return updatedEntry;
  }

  public async selectOnlyNameAndId(): Promise<ThesisDeleteRequest[]> { return await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`).select([`vx._id`, `vx.name`]).getMany(); }

  public async findAll(q: EntityQueryConfig): Promise<ThesisDeleteRequest[]> {
    let qb: SelectQueryBuilder<ThesisDeleteRequest> = await getRepository(ThesisDeleteRequest).createQueryBuilder(`vx`).leftJoinAndSelect(`vx.thesis`, `th`).leftJoinAndSelect(`vx.requester`, `rq`)
      .leftJoinAndSelect(`vx.status`, `st`);

    if (q !== null && q !== undefined) {
      if (q.existsParameter(`updated_min`)) { this.search.minDate(qb, q); }
      else if (q.existsParameter(`updated_max`)) { this.search.maxDate(qb, q); }
    }

    return await qb.select([`vx._id`, `vx.updated_on`, `vx.thesis_id`, `th.title`, `st.name`, `rq.first_name`, `rq.last_name`]).orderBy(`vx.updated_on`, `ASC`).addOrderBy(`vx._id`, `ASC`)
      .limit(10).getMany();
  }

}