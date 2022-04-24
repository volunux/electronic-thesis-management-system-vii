import { QueryResultRow } from 'pg';
import { RowMapper } from './RowMapper';
import { Order } from '../../entity/Order';
import { OrderStatus } from '../../entity/OrderStatus';

export class OrderRowMapper implements RowMapper<Order> {

    process(rowsData : QueryResultRow[]) : Order[] {
      let entries : Order[] = [];
      if (rowsData != null) {
        rowsData.forEach((record : QueryResultRow) => {
          let entry : Order = new Order({'quantity' : 0 , 'delivery_method' : 0 , 'payment_method' : 0 , 'amount' : 0 , 'user_id' : 1 , 'created_on' : new Date() , 'updated_on' : new Date() });
          let orderStatus : OrderStatus = new OrderStatus({});
          entry.setId(record._id);
          entry.setStatus(orderStatus);
          entry.setAmount(record.amount);
          entry.setQuantity(record.quantity);
          entry.setCreatedOn(<Date>record.created_on);
          entry.setUpdatedOn(<Date>record.updated_on);
          entry.setOrderReference(record.order_reference);
          entry.setState(record.state);
          entry.setCity(record.city);
          entry.setContactAddress(record.contact_address);
          entry.setPhoneNumber(record.phone_number);
          entry.setZip(record.zip);
          orderStatus.setName(record.status);

          entries.push(entry); }); }
        return entries;
  }


}