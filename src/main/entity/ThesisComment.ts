import { Thesis } from './Thesis';
import { Discussion } from './abstract/Discussion';
import { ThesisReply } from './ThesisReply';
import { Column, Entity, OneToMany, JoinColumn, ManyToOne, RelationId } from 'typeorm';

@Entity('thesis_comment')
export class ThesisComment extends Discussion {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.thesis_id = data.thesis_id ? data.thesis_id : undefined;
      this.thesis_title = data.thesis_title ? data.thesis_title : undefined;
      this.replies = data.replies ? data.replies : [];
    }
  }

  @ManyToOne(() => Thesis, thesis => thesis.comments, {
    'nullable': false,
    'eager': false,
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'name': 'thesis_id'
  })
  public thesis: Thesis;

  @Column({
    'nullable': false
  })
  @RelationId((comment: ThesisComment) => comment.thesis)
  private thesis_id: number;

  @Column({
    'nullable': true,
    'length': 300
  })
  private thesis_title: string;

  @OneToMany(() => ThesisReply, reply => reply.comment, {
    'cascade': true,
    'eager': false
  })
  public replies: ThesisReply[];


  private replies_ids: number[];

  public getThesisId(): number {
    return this.thesis_id;
  }

  public setThesisId(thesis_id: number): void {
    this.thesis_id = thesis_id;
  }

  public getThesis(): Thesis {
    return this.thesis;
  }

  public setThesis(thesis: Thesis): void {
    this.thesis = thesis;
  }

  public getThesisTitle(): string {
    return this.thesis_title;
  }

  public setThesisTitle(thesis_title: string): void {
    this.thesis_title = thesis_title;
  }

  public getReplies(): ThesisReply[] {
    return this.replies;
  }

  public setReplies(replies: ThesisReply[]): void {
    this.replies = replies;
  }

  public addReply(reply: ThesisReply): void {
    if (this.replies === null || this.replies === undefined) this.replies = [];
    this.replies.push(reply);
  }

  public getRepliesIds(): number[] {
    return this.replies_ids;
  }

  public setRepliesIds(ids: number[]): void {
    this.replies_ids = ids;
  }

  public getRepliesFromIds(): ThesisReply[] {
    return this.repliesFromIds(this.replies_ids);
  }

  public setRepliesFromIds(ids: number[]) {
    this.replies = this.repliesFromIds(ids);
  }

  public repliesFromIds(ids: number[]): ThesisReply[] {
    let context: ThesisComment = this;
    let replies: ThesisReply[] = ids.map((id: number): ThesisReply => {
      let reply: ThesisReply = new ThesisReply();
      reply.setCommentId(context.getId());
      reply.setId(id);
      return reply;
    });
    return replies;
  }

}