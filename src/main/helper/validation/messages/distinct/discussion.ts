import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const discussionMessage : MessageSchema = {
  'text' : ValidationMessageType.getStringInstance(true , 1 , 500 , false , true , 'String')
};