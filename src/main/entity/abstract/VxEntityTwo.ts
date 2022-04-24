import { Column } from 'typeorm';
import { VxEntity } from './VxEntity';

export abstract class VxEntityTwo extends VxEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.name = data.name ? data.name : undefined;
      this.description = data.description ? data.description : "Not Available";
    }
  }

  @Column({
    'nullable': false,
    'unique': true,
    'length': 150,
  })
  private name: string;

  @Column({
    'nullable': true,
    'length': 300,
    'default': 'Not Available'
  })
  private description: string;

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

}