import { EntityManager , getRepository , SelectQueryBuilder , UpdateResult } from 'typeorm';
import { AbstractBaseOrmRepositoryImpl } from '../abstract/AbstractBaseOrmRepositoryImpl';
import { AbbreviationEntitySearch } from '../../../helper/search/impl/AbbreviationEntitySearch';
import { Newable } from '../../../entity/interface/Newable';
import { CheckoutRepository } from '../CheckoutRepository';
import { Order } from '../../../entity/Order';
import { OrderItem } from '../../../entity/OrderItem';
import { PaymentDetail } from '../../../entity/PaymentDetail';
import { User } from '../../../entity/User';
import { Thesis } from '../../../entity/Thesis';
import { CheckoutQuery } from '../../query/CheckoutQuery';
import { DynamicQuery } from '../../query/util/DynamicQuery';
import { VxRepository } from '../../../util/decorators/VxRepository';

@VxRepository()
export class CheckoutRepositoryImpl extends AbstractBaseOrmRepositoryImpl<any> implements CheckoutRepository {

  protected readonly  search : AbbreviationEntitySearch<Order> = AbbreviationEntitySearch.getInstance({});
  private readonly query : CheckoutQuery = new CheckoutQuery();
  protected VxEntity : Newable<Order> = Order;

  public async existsOne(id : string | number) : Promise<boolean> {
    let entry : Order | undefined;
    entry = await getRepository(Order).createQueryBuilder(`vx`).where({'_id' : id}).select([`vx._id`]).limit(1).getOne();
    if (entry === undefined) return false;
    return true;
  } 

  public async verifyOrderItemExistingAndPrice(entry : OrderItem) : Promise<Thesis | undefined> {
    let itemId : number = entry.getItemId();
    let price : string = entry.getUnitPrice().toString();
    return getRepository(Thesis).createQueryBuilder(`vx`).where({'_id' : itemId , 'price' : price}).select([`vx.title`]).limit(1).getOne();
  }

  public async retrieveUserDetails(id : number) : Promise<User | null> {
    let entry : User | undefined = await getRepository(User).createQueryBuilder(`vx`).where({'_id' : id}).select([`vx._id` , `vx.first_name` , `vx.last_name` , `vx.email_address`]).limit(1).getOne();
    if (entry === undefined) return null;
    return entry;
  }

  public async updateTransactionStatus(reference : string , status : string) : Promise<boolean> {
    let manager : EntityManager | null = await this.getTransactionManager();
    let updatedEntry : Order | null = null;
    let plan : DynamicQuery = this.query.updateTransactionStatus(reference , status);

    let result : any = manager !== null ? await manager!.getRepository(Order).query(plan.getText() , plan.getValues()) : await getRepository(Order).query(plan.getText() , plan.getValues());
    if ((<any>result)[1] > 0) { let raw : any = (<any>result)[0][0];
      updatedEntry = new Order(raw); }
    if (updatedEntry === undefined) return false;
    return true;
  } 

  public async saveOrderItem(entry : OrderItem) : Promise<boolean> { return true; }

  public async saveAddress(entry : Order) : Promise<boolean> { return true; }

  public async savePaymentDetail(entry : PaymentDetail , reference : string) : Promise<boolean> {
    let manager : EntityManager | null = await this.getTransactionManager();
    manager !== null ? await manager!.getRepository(PaymentDetail).save(entry) : await getRepository(PaymentDetail).save(entry);
    return true;
  }

  public async saveOrder(entry : Order) : Promise<Order> { 
    let manager : EntityManager | null = await this.getTransactionManager();
    return manager !== null ? await manager!.getRepository(Order).save(entry as any) : await getRepository(Order).save(entry as any); 
  }

}