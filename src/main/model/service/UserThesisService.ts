import { EntityQueryConfig } from '../query/util/EntityQueryConfig';
import { BaseThesisService } from './abstract/BaseThesisService';
import { Thesis } from '../../entity/Thesis';
import { ThesisDeleteRequest } from '../../entity/ThesisDeleteRequest';
import { Order } from '../../entity/Order';
import { OrderItem } from '../../entity/OrderItem';

export interface UserThesisService extends BaseThesisService {
  findAllDeleteRequest(q : EntityQueryConfig , userId : number) : Promise<ThesisDeleteRequest[]>;
  findOneDeleteRequest(id : number , userId : number) : Promise<ThesisDeleteRequest | null>;
  saveDeleteRequest(id : number , entry : ThesisDeleteRequest) : Promise<boolean>;
  entriesDownload(userId : number) : Promise<OrderItem[]>;
  userOrderEntryDownload(userId : number , orderId : number , thesisId : number) : Promise<OrderItem | null>;
  userOrderEntryDownloadDetail(id : string | number) : Promise<Thesis | null>;
}
