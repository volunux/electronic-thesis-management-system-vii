import { ThesisAttachment } from './ThesisAttachment';
import { Entity } from 'typeorm';

@Entity('thesis_document')
export class ThesisDocument extends ThesisAttachment {

  constructor(data?: any) {
    super(data);
  }

}