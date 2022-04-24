import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const userMessages : MessageSchema = {
  'first_name' : ValidationMessageType.getStringInstance(true , 1 , 20 , false , true , 'String') ,
  'last_name' : ValidationMessageType.getStringInstance(true , 1 , 20 , false , true , 'String') ,
  'username' : ValidationMessageType.getStringInstance(true , 1 , 20 , false , true , 'String') ,
  'matriculation_number' : ValidationMessageType.getStringInstance(true , 10 , 15 , false , true , 'String') ,
  'password' : ValidationMessageType.getStringInstance(true , 8 , 30 , false , true , 'String') ,
  'confirm_password' : {
    'any' : { 
      'required' : ValidationMessageType.isRequired() ,
      'only' : 'should match initial password' } ,
    'string' : {
      'min' : ValidationMessageType.minLength(8) ,
      'max' : ValidationMessageType.maxLength(30) ,
      'empty' : ValidationMessageType.isEmpty() ,
      'pattern' : ValidationMessageType.pattern() ,
      'base' : ValidationMessageType.base('String') } } ,
  'current_password' : ValidationMessageType.getStringInstance(true , 8 , 30 , false , true , 'String') ,
  'email_address' : ValidationMessageType.getStringInstance(true , 1 , 50 , false , true , 'String') ,
  'about' : ValidationMessageType.getStringInstance(true , 10 , 300 , false , true , 'String') ,
  'department' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'faculty' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'level' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'country' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'role' : ValidationMessageType.getArrayInstance(true , 1 , 900000000 , false , true , 'Array') ,
  'unit' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'status' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String')

};