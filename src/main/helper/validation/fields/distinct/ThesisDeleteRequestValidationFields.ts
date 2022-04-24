import joi , { NumberSchema , StringSchema , BooleanSchema } from 'joi';
import { SharedAllValidationFields } from '../shared/SharedAllValidationFields';

export class ThesisDeleteRequestValidationFields {

  static getResponse() : StringSchema { return joi.string().min(10).max(500).trim(true).required().label('Response'); }

  static getHandler() : NumberSchema { return SharedAllValidationFields.relationId('Handler'); }

  static getStatus() : NumberSchema { return SharedAllValidationFields.relationId('Status'); }
};