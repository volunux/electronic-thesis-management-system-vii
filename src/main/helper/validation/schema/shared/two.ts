import joi , { ObjectSchema } from 'joi';
import { SharedFiveValidationFields } from '../../fields/shared/SharedFiveValidationFields';

export const twoEntrySchema : ObjectSchema = joi.object().keys({
  'name' : SharedFiveValidationFields.getName() ,
  'description' : SharedFiveValidationFields.getDescription() ,
  'user_id' : SharedFiveValidationFields.getAuthor()
});
