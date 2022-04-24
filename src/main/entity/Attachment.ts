import { VmEntity } from './abstract/VmEntity';
import { Column } from 'typeorm';
import { User } from './User';

export class Attachment extends VmEntity {

  constructor(data?: any) {
    super(data);
    this.location = data.location ? data.location : "Not Available";
    this.mimetype = data.mimetype ? data.mimetype : "Not Available";
    this.size = data.size ? data.size : 100;
    this.key = data.key ? data.key : "Not Available";
    this.author_name = data.author_name ? data.author_name : undefined;
  }

  @Column({
    'nullable': false,
    'length': 200
  })
  private location: string;

  @Column({
    'nullable': true,
    'length': 25,
    'default': 'Not Available'
  })
  private mimetype: string;

  @Column({
    'nullable': true,
    'length': 25,
    'default': 'Not Available'
  })
  private size: string;

  @Column({
    'nullable': false,
    'length': 200
  })
  private key: string;

  public user: User;
  private author_name: string;
  protected user_id?: number;

  public getLocation(): string {
    return this.location;
  }

  public setLocation(location: string): void {
    this.location = location;
  }

  public getMimetype(): string {
    return this.mimetype;
  }

  public setMimetype(mimetype: string): void {
    this.mimetype = mimetype;
  }

  public getSize(): string {
    return this.size;
  }

  public setSize(size: string): void {
    this.size = size;
  }

  public getKey(): string {
    return this.key;
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getAuthorName(): string {
    return this.author_name;
  }

  public setAuthorName(author_name: string): void {
    this.author_name = author_name;
  }

  public getUserId(): number {
    return this.user_id as any;
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