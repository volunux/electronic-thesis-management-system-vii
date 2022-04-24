import { Discussion } from './abstract/Discussion';
import { Entity, ManyToOne, JoinColumn, Column, RelationId } from 'typeorm';
import { ThesisComment } from './ThesisComment';

@Entity('thesis_reply')
export class ThesisReply extends Discussion {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.comment_id = data.comment_id ? data.comment_id : undefined;
    }
  }

  @ManyToOne(() => ThesisComment, comment => comment.replies, {
    'nullable': false,
    'eager': false,
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'name': 'comment_id'
  })
  public comment: ThesisComment;

  @Column({
    'nullable': false
  })
  @RelationId((vx: ThesisReply) => vx.comment)
  private comment_id: number;

  public getCommentId(): number {
    return this.comment_id;
  }

  public setCommentId(comment_id: number): void {
    this.comment_id = comment_id;
  }

  public getComment(): ThesisComment {
    return this.comment;
  }

  public setComment(comment: ThesisComment): void {
    this.comment = comment;
  }

}