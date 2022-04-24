import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const displayMessage : MessageSchema = {
  'display_type' : ValidationMessageType.getStringInstance(true , 1 , 150 , false , true , 'String')
};