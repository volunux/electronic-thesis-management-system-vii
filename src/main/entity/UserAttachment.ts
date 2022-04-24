import { Attachment } from './Attachment';
import { User } from './User';
import { Column, Index, JoinColumn, OneToOne, RelationId } from 'typeorm';

export abstract class UserAttachment extends Attachment {

  constructor(data?: any) {
    super(data);
    if (data) { }
  }

  @Index()
  @OneToOne(() => User, {
    'eager': false,
    'nullable': false,
    'onDelete': 'CASCADE',
  })
  @JoinColumn({
    'name': 'user_id',
  })
  public user: User;

  @Column({
    'nullable': false,
    'unique': true
  })
  @RelationId((att: UserAttachment) => att.user)
  protected user_id?: number;
}