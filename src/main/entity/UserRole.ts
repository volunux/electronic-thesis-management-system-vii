  import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from './User';
import { Role } from './Role';

@Entity('user_role')
export class UserRole {

  @PrimaryColumn()
  @JoinColumn({
    'name': 'user_id'
  })
  @ManyToOne(() => User, {
    'nullable': false,
    'eager': false,
    'onUpdate': 'CASCADE',
    'onDelete': 'CASCADE'
  })
  private user_id: number;

  @PrimaryColumn()
  @ManyToOne(() => Role, {
    'nullable': false,
    'eager': false,
    'onUpdate': 'CASCADE',
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'name': 'role_id'
  })
  private role_id: number;

  public getUserId(): number {
    return this.user_id;
  }

  public setUserId(user_id: number): void {
    this.user_id = user_id;
  }

  public getRoleId(): number {
    return this.role_id;
  }

  public setRoleId(role_id: number): void {
    this.role_id = role_id;
  }

}