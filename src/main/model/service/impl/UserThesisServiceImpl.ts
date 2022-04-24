import { EntityQueryConfig } from '../../query/util/EntityQueryConfig';
import { UserThesisRepository } from '../../repository/UserThesisRepository';
import { UserThesisRepositoryImpl } from '../../repository/impl/UserThesisRepositoryImpl';
import { UserThesisService } from '../UserThesisService';
import { Thesis } from '../../../entity/Thesis';
import { Order } from '../../../entity/Order';
import { OrderItem } from '../../../entity/OrderItem';
import { AbstractBaseThesisServiceImpl } from '../abstract/AbstractBaseThesisServiceImpl';
import { ThesisDeleteRequest } from '../../../entity/ThesisDeleteRequest';

export class UserThesisServiceImpl extends AbstractBaseThesisServiceImpl implements UserThesisService {

  protected readonly repository: UserThesisRepository = new UserThesisRepositoryImpl();

  public async getEntryId(id: number): Promise<number> { return this.repository.getEntryId(id); }

  public async entryDownload(thesisId: number, userId: number): Promise<Thesis | null> { return this.repository.entryDownload(thesisId, userId); }

  public async findOne(id: string, userId?: number): Promise<Thesis | null> { return this.repository.findOne(id, userId); }

  public async userOrderEntryDownloadDetail(id: string): Promise<Thesis | null> { return this.repository.userOrderEntryDownloadDetail(id); }

  public async findOneDeleteRequest(id: number, userId: number): Promise<ThesisDeleteRequest | null> { return this.repository.findOneDeleteRequest(id, userId); }

  public async findAllDeleteRequest(q: EntityQueryConfig, userId: number): Promise<ThesisDeleteRequest[]> { return this.repository.findAllDeleteRequest(q, userId); }

  public async saveDeleteRequest(id: number, entry: ThesisDeleteRequest): Promise<boolean> { return this.repository.saveDeleteRequest(id, entry); }

  public async entriesDownload(userId: number): Promise<OrderItem[]> { return this.repository.entriesDownload(userId); }

  public async userOrderEntryDownload(userId: number, orderId: number, thesisId: number): Promise<OrderItem | null> { return this.repository.userOrderEntryDownload(userId, orderId, thesisId); }
}
