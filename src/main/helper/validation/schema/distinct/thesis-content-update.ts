import joi , { ObjectSchema } from 'joi';
import { ThesisValidationFields } from '../../fields/distinct/ThesisValidationFields';

export const thesisContentUpdateEntrySchema : ObjectSchema = joi.object().keys({
  'content' : ThesisValidationFields.getContent()
});
