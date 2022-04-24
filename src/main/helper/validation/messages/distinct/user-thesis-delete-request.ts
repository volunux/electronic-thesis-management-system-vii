import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const userThesisDeleteRequestMessages : MessageSchema = {
  'message' : ValidationMessageType.getStringInstance(true , 10 , 500 , false , true , 'String') ,
  'thesis' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'requester_id' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'response' : ValidationMessageType.getStringInstance(true , 10 , 500 , false , true , 'String') ,
  'status' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'handler' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String')
};