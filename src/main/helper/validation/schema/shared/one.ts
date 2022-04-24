import joi , { ObjectSchema } from 'joi';
import { SharedOneValidationFields } from '../../fields/shared/SharedOneValidationFields';

export const oneEntrySchema : ObjectSchema = joi.object().keys({
  'name' : SharedOneValidationFields.getName() ,
  'abbreviation' : SharedOneValidationFields.getAbbreviation() ,
  'description' : SharedOneValidationFields.getDescription() ,
  'user_id' : SharedOneValidationFields.getAuthor() 
});