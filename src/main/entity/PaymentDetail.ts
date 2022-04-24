import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity('payment_detail')
export class PaymentDetail {

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({
    'length': 4,
    'nullable': true
  })
  private card_last_four_number: string = "";

  @Column({
    'length': 4,
    'nullable': true
  })
  private exp_year: string;

  @Column({
    'length': '12',
    'nullable': true
  })
  private exp_month: string;

  @Column({
    'length': 45,
    'nullable': true
  })
  private bank_name: string = "";

  @Column({
    'length': 20,
    'nullable': true
  })
  private card_type: string = "";

  @ManyToOne(() => User, {
    'nullable': true,
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'name': 'user_id'
  })
  private user: User;


  private user_id: number;

  constructor(data?: any) {
    if (data) {
      this.card_last_four_number = data.card_last_four_number ? data.card_last_four_number : "";
      this.exp_year = data.exp_year ? data.exp_year : "";
      this.exp_month = data.exp_month ? data.exp_month : "";
      this.bank_name = data.bank_name ? data.bank_name : "";
      this.card_type = data.card_type ? data.card_type : "";
      this.user_id = data.user_id ? data.user_id : "";
    }
  }

  public getCardLastFourNumber(): string {
    return this.card_last_four_number;
  }

  public setCardLastFourNumber(card_last_four_number: string): void {
    this.card_last_four_number = card_last_four_number;
  }

  public getExpYear(): string {
    return this.exp_year;
  }

  public setExpYear(exp_year: string): void {
    this.exp_year = exp_year;
  }

  public getExpMonth(): string {
    return this.exp_month;
  }

  public setExpMonth(exp_month: string): void {
    this.exp_month = exp_month;
  }

  public getBankName(): string {
    return this.bank_name;
  }

  public setBankName(bank_name: string): void {
    this.bank_name = bank_name;
  }

  public getCardType(): string {
    return this.card_type;
  }

  public setCardType(card_type: string): void {
    this.card_type = card_type;
  }

  public getUserId(): number {
    return this.user_id;
  }

  public setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }
}