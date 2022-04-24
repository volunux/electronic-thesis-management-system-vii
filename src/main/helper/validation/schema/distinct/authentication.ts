import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';
import { UserCreateValidationFields } from '../../fields/distinct/UserCreateValidationFields';

export const authenticationEntrySchema : ObjectSchema = joi.object().keys({
  'email_address' : UserValidationFields.getEmailAddress() ,
  'password' : UserCreateValidationFields.getPassword()
});
