import joi , { StringSchema } from 'joi';
import { SharedAllValidationFields } from './SharedAllValidationFields';

export class SharedThreeValidationFields extends SharedAllValidationFields {

  static getText() : StringSchema { return joi.string().min(1).max(500).trim(true).required().label('Text'); }

};