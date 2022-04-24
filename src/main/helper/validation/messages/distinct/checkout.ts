import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const checkoutMessages : MessageSchema = {
  'full_name' : ValidationMessageType.getStringInstance(true , 5 , 40 , false , true , 'String') ,
  'phone_number' : ValidationMessageType.getStringInstance(true , 1 , 15 , false , true , 'String') ,
  'city' : ValidationMessageType.getStringInstance(true , 1 , 25 , false , true , 'String') ,
  'state' : ValidationMessageType.getStringInstance(true , 1 , 25 , false , true , 'String') ,
  'contact_address' : ValidationMessageType.getStringInstance(true , 10 , 60 , false , true , 'String') ,
  'zip' : ValidationMessageType.getStringInstance(true , 1 , 10 , false , true , 'String') ,
  'payment_method' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'delivery_method' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'country' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String')
};