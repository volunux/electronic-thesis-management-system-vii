import joi , { ObjectSchema } from 'joi';
import { ForgotPasswordValidationFields } from '../../fields/distinct/ForgotPasswordValidationFields';

export const forgotPasswordEntrySchema : ObjectSchema = joi.object().keys({
  'email_address' : ForgotPasswordValidationFields.getEmailAddress() 
});
