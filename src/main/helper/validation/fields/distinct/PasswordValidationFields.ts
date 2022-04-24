import joi , { StringSchema } from 'joi';
import { UserValidationFields } from './UserValidationFields';

export class PasswordValidationFields extends UserValidationFields {

  static getPassword(label? : string) : StringSchema { return joi.string().min(8).max(30).trim(true).required().label(label ? label : 'Password'); }

  static getConfirmPassword() : StringSchema { return joi.string().min(8).max(30).trim(true).required().equal(joi.ref('password')).label('Confirm Password'); }

};