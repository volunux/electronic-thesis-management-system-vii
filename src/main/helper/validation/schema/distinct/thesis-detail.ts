import joi , { ObjectSchema } from 'joi';
import { ThesisValidationFields } from '../../fields/distinct/ThesisValidationFields';

export const thesisDetailEntrySchema : ObjectSchema = joi.object().keys({
  'status' : ThesisValidationFields.getStatus() ,
  'uploader_email_address' : ThesisValidationFields.getEmailAddress('Uploader Email Address') ,
  'name_of_uploader' : ThesisValidationFields.getAuthorName(50)
});
