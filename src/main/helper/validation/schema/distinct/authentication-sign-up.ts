import joi , { ObjectSchema } from 'joi';
import { UserValidationFields } from '../../fields/distinct/UserValidationFields';
import { UserCreateValidationFields } from '../../fields/distinct/UserCreateValidationFields';

export const authenticationSignUpEntrySchema : ObjectSchema = joi.object().keys({
  'first_name' : UserCreateValidationFields.getFirstName() ,
  'last_name' : UserCreateValidationFields.getLastName() ,
  'email_address' : UserValidationFields.getEmailAddress() ,
  'username' : UserCreateValidationFields.getUsername() ,
  'country' : UserCreateValidationFields.getCountry() ,
  'password' : UserCreateValidationFields.getPassword() ,
  'confirm_password' : UserCreateValidationFields.getConfirmPassword()
});
