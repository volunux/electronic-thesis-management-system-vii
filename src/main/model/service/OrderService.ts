import { CrudServiceX } from './abstract/CrudServiceX';
import { Order } from '../../entity/Order';
import { User } from '../../entity/User';
import { EntityQueryConfig } from '../query/util/EntityQueryConfig';

export interface OrderService extends CrudServiceX<Order> {
  getOwnerOfOrder(reference : string) : Promise<User | null>;
  findNonComplete(eqp : EntityQueryConfig , userId? : number) : Promise<Order[]>;
}
