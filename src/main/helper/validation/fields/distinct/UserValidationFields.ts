import joi , { NumberSchema , StringSchema } from 'joi';
import { SharedAllValidationFields } from '../shared/SharedAllValidationFields';

export class UserValidationFields extends SharedAllValidationFields {

  static getFirstName() : StringSchema { return joi.string().min(1).max(20).trim(true).required().label('First Name'); }

  static getLastName() : StringSchema { return joi.string().min(1).max(20).trim(true).required().label('Last Name'); }

  static getEmailAddress() : StringSchema { return SharedAllValidationFields.getEmailAddress('Email Address'); }

  static getUsername() : StringSchema { return joi.string().min(1).max(20).trim(true).required().label('Username'); }

  static getAbout() : StringSchema { return joi.string().min(10).max(300).trim(true).required().label('About'); }

  static getMatriculationNumber() : StringSchema { return joi.string().min(10).max(15).trim(true).required().label('Matriculation Number'); }

  static getCountry() : NumberSchema { return this.relationId('Country'); }

  static getDepartment() : NumberSchema { return this.relationId('Department'); }

  static getFaculty() : NumberSchema { return this.relationId('Faculty'); }

  static getLevel() : NumberSchema { return this.relationId('Level'); }

};