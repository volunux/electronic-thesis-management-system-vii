import QueryClient from '../../query/util/QueryClient';
import { Logger } from 'winston';
import SimpleLogger from '../../../util/other/Logger';
import { AbstractBaseServiceImpl } from '../abstract/AbstractBaseServiceImpl';
import { CheckoutRepository } from '../../repository/CheckoutRepository';
import { CheckoutRepositoryImpl } from '../../repository/impl/CheckoutRepositoryImpl';
import { OrderStatusRepository } from '../../repository/OrderStatusRepository';
import { OrderStatusRepositoryImpl } from '../../repository/impl/OrderStatusRepositoryImpl';
import { CheckoutService } from '../CheckoutService';
import { Order } from '../../../entity/Order';
import { OrderItem } from '../../../entity/OrderItem';
import { User } from '../../../entity/User';
import { Thesis } from '../../../entity/Thesis';
import { PaymentDetail } from '../../../entity/PaymentDetail';
import { OrderStatus } from '../../../entity/OrderStatus';
import { CrudRepository } from '../../repository/generic/Repository';

export class CheckoutServiceImpl extends AbstractBaseServiceImpl<any> implements CheckoutService {

	protected readonly repository: CheckoutRepository = new CheckoutRepositoryImpl();
	private readonly orderStatusRepository: OrderStatusRepository = new OrderStatusRepositoryImpl();
	private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': CheckoutRepositoryImpl.name });

	public async saveOrder(entry: Order): Promise<Order | null> {
		let clt: QueryClient = await this.repository.getOrmClient();
		let ctx: CheckoutServiceImpl = await this.transactionalService.get<CheckoutServiceImpl>(this);
		let repos: CrudRepository<any>[] = [ctx.repository];
		let order: Order | null = null;
		let entryUpdated: boolean = true;

		for (let orderItem of entry.getOrderItems()) { orderItem.setOrderId(entry.getId()); }

		try {
			await clt.beginTransaction([...repos], ctx);
			let orderStatus: OrderStatus | null = await ctx.orderStatusRepository.findByName('Pending');
			if (orderStatus !== null) entry.setStatus(orderStatus);
			order = await ctx.repository.saveOrder(entry);
			await clt.commit();
		}
		catch (err: any) {
			this.logger.error(err);
			await clt.rollback(); order = null;
		}
		finally { await clt.endTransaction(); }
		return order;
	}

	public async saveOrderItem(entry: Order): Promise<boolean> {
		let saved: boolean = true;
		let orderItemsSaved: boolean[] = [];
		let orderItemsPromise: Promise<boolean>[] = [];
		for (let orderItem of entry.getOrderItems()) {
			orderItem.setOrderId(entry.getId());
			orderItemsPromise.push(this.repository.saveOrderItem(orderItem));
		}
		orderItemsSaved = await Promise.all(orderItemsPromise);
		return saved;
	}

	public async saveAddress(entry: Order): Promise<boolean> {
		return this.repository.saveAddress(entry);
	}

	public async verifyOrderItemExistingAndPrice(entries: OrderItem[]): Promise<boolean> {
		let entryExists: boolean = true;
		let itemsExisting: (Thesis | undefined)[] = [];
		let itemsExistingPromise: Promise<Thesis | undefined>[] = [];
		for (let orderItem of entries) { itemsExistingPromise.push(this.repository.verifyOrderItemExistingAndPrice(orderItem)); }
		itemsExisting = await Promise.all(itemsExistingPromise);
		for (let existing of itemsExisting) {
			if (existing === undefined) {
				entryExists = false;
				break;
			}
		}
		return entryExists;
	}

	public async processPayment(entry: PaymentDetail, reference: string, transactionStatus: string): Promise<boolean> {
		let clt: QueryClient = await this.repository.getOrmClient();
		let ctx: CheckoutServiceImpl = await this.transactionalService.get<CheckoutServiceImpl>(this);
		let repos: CrudRepository<any>[] = [ctx.repository];
		let processed: boolean = true;
		await clt.beginTransaction([...repos], ctx);

		try {
			if (transactionStatus === "success") { await ctx.repository.updateTransactionStatus(reference, 'Completed'); }
			else { await ctx.repository.updateTransactionStatus(reference, 'Failed'); }
			await ctx.repository.savePaymentDetail(entry, reference);
			await clt.commit();
		}
		catch (err: any) {
			this.logger.error(err);
			await clt.rollback(); processed = false;
		}
		finally { await clt.endTransaction(); }
		return processed;
	}

	public async retrieveUserDetails(userId: number): Promise<User | null> { return this.repository.retrieveUserDetails(userId); }

	public async updateTransactionStatus(reference: string, status: string): Promise<boolean> { return this.repository.updateTransactionStatus(reference, status); }

	public async savePaymentDetail(entry: PaymentDetail, reference: string): Promise<boolean> { return this.repository.savePaymentDetail(entry, reference); }
}