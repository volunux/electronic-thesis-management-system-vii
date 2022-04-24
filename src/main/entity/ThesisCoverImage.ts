import { ThesisAttachment } from './ThesisAttachment';
import { Entity } from 'typeorm';

@Entity('thesis_cover_image')
export class ThesisCoverImage extends ThesisAttachment {

  constructor(data?: any) {
    super(data);
  }
}