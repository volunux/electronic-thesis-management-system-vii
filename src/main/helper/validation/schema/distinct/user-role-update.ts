import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';

export const userRoleUpdateEntrySchema : ObjectSchema = joi.object().keys({
  'first_name' : UserValidationFields.getFirstName() ,
  'last_name' : UserValidationFields.getLastName() ,
  'matriculation_number' : UserValidationFields.getMatriculationNumber() ,
  'role' : joi.array().required().min(1).label('Role')
});
