import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('object_sweep')
export class ObjectSweep {

  constructor(data?: any) {
    if (data) {
      this.bucketName = data.bucketName ? data.bucketName : undefined;
      this.key = data.key ? data.key : undefined;
    }
  }

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column({
    'name': 'bucket_name',
    'length': 200,
    'nullable': true
  })
  private bucketName: string;

  @Column({
    'length': 200,
    'nullable': false
  })
  private key: string;

  public getId(): number {
    return this._id;
  }

  public setId(id: number): void {
    this._id = id;
  }

  public getBucketName(): string {
    return this.bucketName;
  }

  public setBucketName(bucketName: string): void {
    this.bucketName = bucketName;
  }

  public getKey(): string {
    return this.key;
  }

  public setKey(key: string): void {
    this.key = key;
  }
}