import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, BeforeUpdate } from 'typeorm';
import { VxEntityTwo } from './abstract/VxEntityTwo';
import { User } from './User';

@Entity()
export class Role extends VxEntityTwo {

  @Column({
    'nullable': false,
    'unique': false,
    'length': 150
  })
  private word: string;

  constructor(data?: any) {
    super(data);
    if (data) {
      this.word = data.word ? data.word : undefined;
    }
  }

  public getWord(): string {
    return this.word;
  }

  public setWord(word: string): void {
    this.word = word;
  }

  public getUser(): User {
    return this.user;
  }

  public setUser(user: User): void {
    this.user = user;
  }

}