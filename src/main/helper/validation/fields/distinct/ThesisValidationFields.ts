import joi , { NumberSchema , StringSchema } from 'joi';
import { SharedAllValidationFields } from '../shared/SharedAllValidationFields';

export class ThesisValidationFields extends SharedAllValidationFields {

  static getTitle() : StringSchema { return joi.string().min(10).max(200).trim(true).required().label('Title'); }

  static getPrice() : StringSchema { return joi.string().min(1).max(12).required().label('Price'); }

  static getContent() : StringSchema { return joi.string().min(1).max(5000).trim(true).required().label('Content'); }

  static getNumberOfPage() : StringSchema { return joi.string().min(1).max(5).required().label('Number of Pages'); }

  static getGrade() : StringSchema { return joi.string().min(1).max(2).required().label('Grade'); }

  static getDepartment() : NumberSchema { return this.relationId('Department'); }

  static getFaculty() : NumberSchema { return this.relationId('Faculty'); }

  static getPublisher() : NumberSchema { return this.relationId('Publisher'); }

  static getSupervisor() : StringSchema { return joi.string().min(1).max(50).trim(true).required().label('Supervisor'); }

  static getPublicationYear() : StringSchema { return joi.string().min(1).max(4).trim(true).required().label('Publication Year'); }

  static getAuthor() : NumberSchema { return this.relationId('Author'); }

  static getUser() : NumberSchema { return this.relationId('User Profile'); }

  static getSlug() : StringSchema { return SharedAllValidationFields.getSlug(); } };