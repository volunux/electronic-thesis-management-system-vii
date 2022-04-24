import { VmEntity } from './abstract/VmEntity';
import { Thesis } from './Thesis';
import { User } from './User';
import { ThesisDeleteRequestStatus } from './ThesisDeleteRequestStatus';
import { Entity, Column, JoinColumn, RelationId, ManyToOne, BeforeInsert } from 'typeorm';

@Entity('thesis_delete_request')
export class ThesisDeleteRequest extends VmEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.message = data.message ? data.message : undefined;
      this.response = data.response ? data.response : undefined;
      this.requester = data.requester ? data.requester : undefined;
      this.thesis = data.thesis ? data.thesis : undefined;
      this.status = data.status ? data.status : undefined;
      this.handler = data.handler ? data.handler : undefined;
      this.email_address = data.email_address ? data.email_address : undefined;
      this.title = data.title ? data.title : undefined;
      this.requester_id = data.requester ? data.requester : undefined;
      this.handler_id = data.handler ? data.handler : undefined;
      this.thesis_id = data.thesis ? data.thesis : undefined;
      this.status_id = data.status ? data.status : undefined;
    }
  }

  @Column({
    'length': 500,
    'nullable': false
  })
  private message: string;

  @Column({
    'length': 500,
    'nullable': true,
    'default': 'Not Available'
  })
  private response: string;

  @ManyToOne(() => Thesis, {
    'nullable': false,
    'eager': false,
    'onDelete': 'CASCADE'
  })
  @JoinColumn({
    'name': 'thesis_id'
  })
  private thesis: Thesis;

  @Column({
    'nullable': false
  })
  @RelationId((vx: ThesisDeleteRequest) => vx.thesis)
  private thesis_id: number;


  @ManyToOne(() => User, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'requester_id'
  })
  private requester: User;

  @Column({
    'nullable': true
  })
  @RelationId((vx: ThesisDeleteRequest) => vx.requester)
  private requester_id: number;


  @ManyToOne(() => User, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'handler_id'
  })
  private handler?: User;

  @Column({
    'nullable': true
  })
  @RelationId((vx: ThesisDeleteRequest) => vx.handler)
  private handler_id?: number;


  @ManyToOne(() => ThesisDeleteRequestStatus, {
    'nullable': true,
    'eager': false,
    'onDelete': 'SET NULL'
  })
  @JoinColumn({
    'name': 'status_id'
  })
  private status: ThesisDeleteRequestStatus;

  @Column({
    'nullable': true
  })
  @RelationId((vx: ThesisDeleteRequest) => vx.status)
  private status_id: number;


  private title?: string;
  private email_address?: string;

  public getMessage(): string {
    return this.message;
  }

  public setMessage(message: string): void {
    this.message = message;
  }

  public getResponse(): string {
    return this.response;
  }

  public setResponse(response: string): void {
    this.response = response;
  }

  public getThesis(): Thesis {
    return this.thesis;
  }

  public setThesis(thesis: Thesis): void {
    this.thesis = thesis;
  }

  public getThesisId(): number {
    return this.thesis_id;
  }

  public getRequester(): User {
    return this.requester;
  }

  public setRequester(requester: User): void {
    this.requester = requester;
  }

  public getRequesterId(): number {
    return this.requester_id;
  }

  public setRequesterId(requester_id: number): void {
    this.requester_id = requester_id;
  }

  public getTitle(): string {
    return (<any>this.title);
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getStatus(): ThesisDeleteRequestStatus {
    return this.status;
  }

  public setStatus(status: ThesisDeleteRequestStatus): void {
    this.status = status;
  }

  public getStatusId(): number {
    return this.status_id;
  }

  public getHandler(): User {
    return (<any>this.handler);
  }

  public setHandler(handler: User): void {
    this.handler = handler;
  }

  public getHandlerId(): number {
    return this.handler_id as any;
  }

  public setHandlerId(handler_id: number): void {
    this.handler_id = handler_id;
  }

  public getEmailAddress(): string {
    return (<any>this.email_address);
  }

  public setEmailAddress(email_address: string): void {
    this.email_address = email_address;
  }

  @BeforeInsert()
  private deleteTransientProperties() {
    delete this.title;
    delete this.email_address;
    delete this.handler;
    delete this.handler_id;
  }
}