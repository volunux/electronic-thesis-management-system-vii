import { AbstractBaseQueryImpl } from './impl/AbstractBaseQueryImpl';
import { DynamicQuery } from './util/DynamicQuery';
import { Order } from '../../entity/Order';

export class CheckoutQuery extends AbstractBaseQueryImpl<Order> {

  public updateTransactionStatus(reference: string, status: string): DynamicQuery {
    let text: string = `UPDATE ORDERS AS vx SET status_id = st._id , updated_on = $2 FROM ORDER_STATUS AS st WHERE order_reference = $1 AND st.name = $3 RETURNING vx._id`;
    let values: any[] = [reference, 'NOW()', status];

    return DynamicQuery.create(text, values);
  }

  public saveAddress(entry: Order): DynamicQuery {
    let text: string = `INSERT INTO USER_ADDRESS(contact_address , state , city , zip , phone_number , user_id) VALUES($1 , $2 , $3 , $4 , $5 , $6)`;
    let values: any[] = [entry.getContactAddress(), entry.getState(), entry.getCity(), entry.getZip(), entry.getPhoneNumber(), entry.getUserId()];

    return DynamicQuery.create(text, values);
  }

}