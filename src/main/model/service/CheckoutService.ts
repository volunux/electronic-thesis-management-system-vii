import { CrudServiceX } from './abstract/CrudServiceX';
import { Checkout } from '../../entity/Checkout';
import { Order } from '../../entity/Order';
import { OrderItem } from '../../entity/OrderItem';
import { User } from '../../entity/User';
import { PaymentDetail } from '../../entity/PaymentDetail';

export interface CheckoutService extends CrudServiceX<Checkout> {
  saveOrder(entry : Order) : Promise<Order | null>;
  verifyOrderItemExistingAndPrice(entry : OrderItem[]) : Promise<boolean>;
  retrieveUserDetails(id : number) : Promise<User | null>;
  updateTransactionStatus(reference : string , status : string) : Promise<boolean>;
  savePaymentDetail(entry : PaymentDetail , reference : string) : Promise<boolean>;
  processPayment(entry : PaymentDetail , reference : string , transactionStatus : string) : Promise<boolean>;
}
