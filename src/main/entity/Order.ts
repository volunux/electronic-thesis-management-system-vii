import { Entity, Column, ManyToOne, OneToMany, JoinColumn, RelationId } from 'typeorm';
import { DeliveryMethod } from './DeliveryMethod';
import { PaymentMethod } from './PaymentMethod';
import { OrderItem } from './OrderItem';
import { OrderStatus } from './OrderStatus';
import { Country } from './Country';
import { VxEntity } from './abstract/VxEntity';

@Entity('orders')
export class Order extends VxEntity {

  @Column()
  private quantity: number;

  @Column()
  private amount: number;

  @Column()
  private order_reference: string;

  @ManyToOne(() => OrderStatus, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'status_id'
  })
  private status: OrderStatus;

  @Column({
    'nullable': true
  })
  @RelationId((order: Order) => order.status)
  private status_id: number;

  @ManyToOne(() => DeliveryMethod, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'delivery_method_id'
  })
  private delivery_method: DeliveryMethod;

  @Column({
    'nullable': true
  })
  @RelationId((order: Order) => order.delivery_method)
  private delivery_method_id: number;

  @ManyToOne(() => Country, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'country_id'
  })
  public country: Country;

  @Column({
    'nullable': true
  })
  @RelationId((order: Order) => order.country)
  private country_id: number;

  @ManyToOne(() => PaymentMethod, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'payment_method_id'
  })
  private payment_method: PaymentMethod;

  @Column({
    'nullable': true
  })
  @RelationId((order: Order) => order.payment_method)
  private payment_method_id: number;


  @OneToMany(() => OrderItem, item => item.order, {
    'cascade': true,
    'eager': false
  })
  public items: OrderItem[];


  /***************************Shipping Detail Start ******************************/

  @Column({
    'length': 30,
    'nullable': true,
  })
  private state: string;

  @Column({
    'length': 30,
    'nullable': true,
  })
  private city: string;

  @Column({
    'length': 300,
    'nullable': true,
  })
  private contact_address: string;

  @Column({
    'length': 10,
    'nullable': true,
  })
  private zip: string;

  @Column({
    'length': 15,
    'nullable': true,
  })
  private phone_number: string;

  /***************************Shipping Detail End ******************************/


  constructor(data?: any) {
    super(data);
    if (data) {
      this.order_reference = data.order_reference ? data.order_reference : "";
      this.quantity = data.quantity ? data.quantity : 0;
      this.amount = data.amount ? data.amount : 0;
      this.status = data.status ? data.status : undefined;
      this.status_id = data.status ? data.status : undefined;
      this.delivery_method = data.delivery_method ? data.delivery_method : 0;
      this.delivery_method_id = data.delivery_method ? data.delivery_method : 0;
      this.payment_method = data.payment_method ? data.payment_method : 0;
      this.payment_method_id = data.payment_method ? data.payment_method : 0;
      this.country = data.country ? data.country : undefined;
      this.country_id = data.country ? data.country : undefined;

      this.state = data.state ? data.state : undefined;
      this.city = data.city ? data.city : undefined;
      this.contact_address = data.contact_address ? data.contact_address : undefined;
      this.zip = data.zip ? data.zip : undefined;
      this.phone_number = data.phone_number ? data.phone_number : undefined;
    }
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number): void {
    this.amount = amount;
  }

  public getDeliveryMethodId(): number {
    return this.delivery_method_id;
  }

  public setDeliveryMethodId(delivery_method_id: number): void {
    this.delivery_method_id = delivery_method_id;
  }

  public getDeliveryMethod(): DeliveryMethod | null {
    return this.delivery_method;
  }

  public setDeliveryMethod(delivery_method: DeliveryMethod): void {
    this.delivery_method = delivery_method;
  }

  public getPaymentMethodId(): number {
    return this.payment_method_id;
  }

  public setPaymentMethodId(payment_method_id: number): void {
    this.payment_method_id = payment_method_id;
  }

  public getPaymentMethod(): PaymentMethod {
    return this.payment_method;
  }

  public setPaymentMethod(payment_method: PaymentMethod): void {
    this.payment_method = payment_method;
  }

  public getOrderItems(): OrderItem[] {
    return this.items;
  }

  public setOrderItems(items: OrderItem[]): void {
    this.items = items;
  }

  public getStatusId(): number {
    return this.status_id;
  }

  public setStatusId(status_id: number): void {
    this.status_id = status_id;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setStatus(status: OrderStatus): void {
    this.status = status;
  }

  public getOrderReference(): string {
    return this.order_reference;
  }

  public setOrderReference(order_reference: string): void {
    this.order_reference = order_reference;
  }

  public getCountryId(): number {
    return this.country_id;
  }

  public setCountryId(country_id: number): void {
    this.country_id = country_id;
  }

  public getCountry(): Country {
    return this.country;
  }

  public setCountry(country: Country): void {
    this.country = country;
  }

  public getCity(): string {
    return this.city;
  }

  public setCity(city: string): void {
    this.city = city;
  }

  public getState(): string {
    return this.state;
  }

  public setState(state: string): void {
    this.state = state;
  }

  public getContactAddress(): string {
    return this.contact_address;
  }

  public setContactAddress(contact_address: string): void {
    this.contact_address = contact_address;
  }

  public getPhoneNumber(): string {
    return this.phone_number;
  }

  public setPhoneNumber(phone_number: string): void {
    this.phone_number = phone_number;
  }

  public getZip(): string {
    return this.zip;
  }

  public setZip(zip: string): void {
    this.zip = zip;
  }

}