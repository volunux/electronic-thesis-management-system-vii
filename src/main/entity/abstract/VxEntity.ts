import { Column, Index, JoinColumn, ManyToOne, RelationId } from 'typeorm';
import { VmEntity } from './VmEntity';
import { User } from '../User';

export abstract class VxEntity extends VmEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.user_id = data.user_id ? data.user_id : undefined;
      this.user = data.user ? data.user : undefined;
    }
  }

  @Index()
  @ManyToOne(() => User, {
    'eager': false,
    'nullable': true,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'user_id'
  })
  public user: User;

  @Column({
    'nullable': true
  })
  @RelationId((self: VxEntity) => self.user)
  protected user_id?: number;

  public getUserId(): number {
    return this.user_id as any;
  }

  public setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  public getUser(): User {
    return this.user as any;
  }

  public setUser(user: User): void {
    this.user = user;
  }

}