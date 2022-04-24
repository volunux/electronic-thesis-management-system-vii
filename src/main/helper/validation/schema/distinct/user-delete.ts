import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';

export const userDeleteEntrySchema : ObjectSchema = joi.object().keys({
  'first_name' : UserValidationFields.getFirstName() ,
  'last_name' : UserValidationFields.getLastName() ,
  'matriculation_number' : UserValidationFields.getMatriculationNumber() ,
  'email_address' : UserValidationFields.getEmailAddress()
});
