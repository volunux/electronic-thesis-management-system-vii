import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { User } from '../../entity/User';
import { Checkout } from '../../entity/Checkout';
import { Order } from '../../entity/Order';
import { OrderItem } from '../../entity/OrderItem';
import { PaymentDetail } from '../../entity/PaymentDetail';
import { Thesis } from '../../entity/Thesis';

export interface CheckoutRepository extends CrudRepositoryX<Checkout> {

  saveOrder(entry: Order): Promise<Order>;
  saveOrderItem(entry: OrderItem): Promise<boolean>;
  saveAddress(entry: Order): Promise<boolean>;
  verifyOrderItemExistingAndPrice(entry: OrderItem): Promise<Thesis | undefined>;
  retrieveUserDetails(userId: number): Promise<User | null>;
  updateTransactionStatus(reference: string, status: string): Promise<boolean>
  savePaymentDetail(entry: PaymentDetail, reference: string): Promise<boolean>;

} 