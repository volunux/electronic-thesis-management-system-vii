import { BeforeUpdate, Column, Index, PrimaryGeneratedColumn } from 'typeorm';

export abstract class VmEntity {

  constructor(data?: any) {

    if (data) {
      this._id = data._id ? data._id : undefined;
      this.created_on = data.created_on ? data.created_on : new Date();
      this.updated_on = data.updated_on ? data.updated_on : new Date();
    }
  }

  @PrimaryGeneratedColumn()
  private _id: number;

  @Column('timestamptz', {
    'nullable': false,
    'default': () => 'CURRENT_TIMESTAMP',
  })
  private created_on?: Date;

  @Index()
  @Column('timestamptz', {
    'nullable': false,
    'default': () => 'CURRENT_TIMESTAMP'
  })
  private updated_on: Date;


  public getId(): number {
    return this._id
  }

  public setId(id: number): void {
    this._id = id;
  }

  public getCreatedOn(): Date {
    return this.created_on as Date;
  }

  public setCreatedOn(created_on: Date): void {
    this.created_on = created_on;
  }

  public getUpdatedOn(): Date {
    return this.updated_on;
  }

  public setUpdatedOn(updated_on: Date): void {
    this.updated_on = updated_on;
  }

  @BeforeUpdate()
  public deleteUndefineds() {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => { if (obj[key] === undefined || obj[key] === null) delete obj[key]; });
    };
    delete this.created_on;
    removeEmpty(this);
  }

}