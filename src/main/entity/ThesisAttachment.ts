import { Attachment } from './Attachment';
import { User } from './User';
import { Column, Index, JoinColumn, OneToOne, ManyToOne, RelationId } from 'typeorm';
import { Thesis } from './Thesis';

export class ThesisAttachment extends Attachment {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.thesis = data.thesis ? data.thesis : undefined;
      this.thesis_id = data.thesis_id ? data.thesis_id : undefined;
      this.user = data.user ? data.user : undefined;
      this.user_id = data.user ? data.user : undefined;
    }
  }

  @OneToOne(() => Thesis, {
    'nullable': false,
    'eager': false,
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'referencedColumnName': '_id',
    'name': 'thesis_id'
  })
  public thesis: Thesis;

  @Index()
  @Column({
    'nullable': false
  })
  @RelationId((att: ThesisAttachment) => att.thesis)
  public thesis_id: string;

  @Index()
  @ManyToOne(() => User, {
    'eager': false,
    'nullable': true,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'user_id',
  })
  public user: User;

  @Column({
    'nullable': true
  })
  @RelationId((att: ThesisAttachment) => att.user)
  protected user_id?: number;

  public getThesisId(): string {
    return this.thesis_id;
  }

  public setThesisId(thesisId: string): void {
    this.thesis_id = thesisId;
  }

  public getThesis(): Thesis {
    return this.thesis;
  }

  public setThesis(thesis: Thesis): void {
    this.thesis = thesis;
  }

}