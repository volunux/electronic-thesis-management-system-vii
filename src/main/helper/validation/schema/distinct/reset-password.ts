import joi , { ObjectSchema } from 'joi';
import { PasswordValidationFields } from '../../fields/distinct/PasswordValidationFields';

export const resetPasswordEntrySchema : ObjectSchema = joi.object().keys({
  'password' : PasswordValidationFields.getPassword() ,
  'confirm_password' : PasswordValidationFields.getConfirmPassword() 
});
