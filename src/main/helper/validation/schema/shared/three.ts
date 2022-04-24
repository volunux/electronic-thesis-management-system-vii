import joi , { ObjectSchema } from 'joi';
import { SharedThreeValidationFields } from '../../fields/shared/SharedThreeValidationFields';

export const threeEntrySchema : ObjectSchema = joi.object().keys({
  'text' : SharedThreeValidationFields.getText() ,
  'user_id' : SharedThreeValidationFields.getAuthor() 
});
