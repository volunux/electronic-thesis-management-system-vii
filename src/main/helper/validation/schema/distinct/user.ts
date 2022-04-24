import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';

export const userEntrySchema : ObjectSchema = joi.object().keys({
  'first_name' : UserValidationFields.getFirstName() ,
  'last_name' : UserValidationFields.getLastName() ,
  'email_address' : UserValidationFields.getEmailAddress() ,
  'username' : UserValidationFields.getUsername() ,
  'about' : UserValidationFields.getAbout() ,
  'matriculation_number' : UserValidationFields.getMatriculationNumber() ,
  'department' : UserValidationFields.getDepartment() ,
  'faculty' : UserValidationFields.getFaculty() ,
  'level' : UserValidationFields.getLevel() ,
  'country' : UserValidationFields.getCountry() ,
  'status' : UserValidationFields.getStatus()
});
