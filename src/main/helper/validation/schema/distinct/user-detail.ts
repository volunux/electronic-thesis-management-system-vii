import joi , { ObjectSchema } from 'joi';
import { SharedAllValidationFields } from '../../fields/shared/SharedAllValidationFields';

export const userDetailEntrySchema : ObjectSchema = joi.object().keys({
  'status' : SharedAllValidationFields.getStatus() ,
  'user_email_address' : SharedAllValidationFields.getEmailAddress('User Email Address') ,
  'user_full_name' : SharedAllValidationFields.getAuthorName(50)
});
