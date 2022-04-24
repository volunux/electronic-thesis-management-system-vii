import joi , { ObjectSchema } from 'joi';
import { SharedOneValidationFields } from '../../fields/shared/SharedOneValidationFields';

export const roleEntrySchema : ObjectSchema = joi.object().keys({
  'name' : SharedOneValidationFields.getName() ,
  'word' : SharedOneValidationFields.getWord() ,
  'description' : SharedOneValidationFields.getDescription() ,
  'user_id' : SharedOneValidationFields.getAuthor() 
});
