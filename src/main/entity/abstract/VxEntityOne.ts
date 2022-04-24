import { Column, Index } from 'typeorm';
import { VxEntity } from './VxEntity';

export abstract class VxEntityOne extends VxEntity {

  constructor(data?: any) {
    super(data);
    if (data) {
      this.name = data.name;
      this.abbreviation = data.abbreviation ? data.abbreviation : undefined;
      this.description = data.description ? data.description : "Not Available";
    }
  }

  @Index()
  @Column({
    'nullable': false,
    'unique': true,
    'length': 150,
  })
  private name: string;

  @Index()
  @Column({
    'nullable': false,
    'unique': true,
    'length': 8,
  })
  private abbreviation: string;

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

  public getAbbreviation(): string {
    return this.abbreviation;
  }

  public setAbbreviation(abbreviation: string): void {
    this.abbreviation = abbreviation;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }

}