import { EntityQueryConfig } from '../query/util/EntityQueryConfig';
import { BaseThesisRepository } from './generic/BaseThesisRepository';
import { ThesisDeleteRequest } from '../../entity/ThesisDeleteRequest';
import { Thesis } from '../../entity/Thesis';
import { OrderItem } from '../../entity/OrderItem';

export interface UserThesisRepository extends BaseThesisRepository {

  findAllDeleteRequest(q: EntityQueryConfig, userId: number): Promise<ThesisDeleteRequest[]>;
  findOneDeleteRequest(id: number, userId: number): Promise<ThesisDeleteRequest | null>;
  saveDeleteRequest(id: number, entry: ThesisDeleteRequest): Promise<boolean>;
  entriesDownload(userId: number): Promise<OrderItem[]>;
  userOrderEntryDownload(userId: number, orderId: number, thesisId: number): Promise<OrderItem | null>;
  userOrderEntryDownloadDetail(id: string): Promise<Thesis | null>;
} 