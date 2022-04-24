import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const forgotPasswordMessages : MessageSchema = {
  'email_address' : ValidationMessageType.getStringInstance(true , 1 , 50 , false , true , 'String')
};