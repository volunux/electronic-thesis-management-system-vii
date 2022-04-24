import joi , { ObjectSchema } from 'joi';
import { PasswordValidationFields } from '../../fields/distinct/PasswordValidationFields';

export const passwordChangeEntrySchema : ObjectSchema = joi.object().keys({
  'current_password' : PasswordValidationFields.getPassword('Current Password') ,
  'password' : PasswordValidationFields.getPassword() ,
  'confirm_password' : PasswordValidationFields.getConfirmPassword() 
});
