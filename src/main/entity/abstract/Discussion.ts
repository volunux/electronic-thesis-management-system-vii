import { Column } from 'typeorm';
import { VxEntity } from './VxEntity';

export abstract class Discussion extends VxEntity {

  constructor(data?: any) {
    super(data);

    if (data) {
      this.text = data.text ? data.text : undefined;
      this.author_name = data.author_name ? data.author_name : "Anonymous";
    }
  }

  @Column({
    'length': 500,
    'nullable': false
  })
  private text: string;

  @Column({
    'length': 40,
    'nullable': true,
    'readonly': true,
    'default': 'Anonymous'
  })
  private author_name: string;

  public getText(): string {
    return this.text;
  }

  public setText(text: string): void {
    this.text = text;
  }

  public getAuthorName(): string {
    return this.author_name;
  }

  public setAuthorName(author_name: string): void {
    this.author_name = author_name;
  }

}