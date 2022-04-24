import { SharedAllValidationFields } from './SharedAllValidationFields';
import joi , { NumberSchema , StringSchema } from 'joi';

export class SharedFiveValidationFields extends SharedAllValidationFields {

  static getTitle() : StringSchema { return joi.string().min(1).max(150).trim(true).required().label('Title'); }

};