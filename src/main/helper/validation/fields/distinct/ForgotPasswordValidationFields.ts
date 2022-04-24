import joi , { StringSchema } from 'joi';
import { SharedAllValidationFields } from '../shared/SharedAllValidationFields';

export class ForgotPasswordValidationFields extends SharedAllValidationFields {

  static getEmailAddress() : StringSchema { return SharedAllValidationFields.getEmailAddress(); }
};