import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';

export const userUpdateEntrySchema : ObjectSchema = joi.object().keys({
  'first_name' : UserValidationFields.getFirstName() ,
  'last_name' : UserValidationFields.getLastName() ,
  'matriculation_number' : UserValidationFields.getMatriculationNumber() ,
  'about' : UserValidationFields.getAbout() ,
  'department' : UserValidationFields.getDepartment() ,
  'faculty' : UserValidationFields.getFaculty() ,
  'level' : UserValidationFields.getLevel() ,
  'country' : UserValidationFields.getCountry() ,
  'status' : UserValidationFields.getStatus()
});
