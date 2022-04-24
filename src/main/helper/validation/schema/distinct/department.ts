import joi , { ObjectSchema } from 'joi';
import { SharedOneValidationFields } from '../../fields/shared/SharedOneValidationFields';

export const departmentEntrySchema : ObjectSchema = joi.object().keys({
  'name' : SharedOneValidationFields.getName() ,
  'abbreviation' : SharedOneValidationFields.getAbbreviation() ,
  'description' : SharedOneValidationFields.getDescription() ,
  'user_id' : SharedOneValidationFields.getAuthor() ,
  'faculty' : joi.string().min(1).max(900000000).required().label('Faculty')
});
