import joi , { ObjectSchema } from 'joi';
import { ThesisDeleteRequestValidationFields } from '../../fields/distinct/ThesisDeleteRequestValidationFields';

export const thesisDeleteRequestEntrySchema : ObjectSchema = joi.object().keys({
  'response' : ThesisDeleteRequestValidationFields.getResponse() ,
  'status' : ThesisDeleteRequestValidationFields.getStatus() ,
  'handler_id' : ThesisDeleteRequestValidationFields.getHandler() 
});
