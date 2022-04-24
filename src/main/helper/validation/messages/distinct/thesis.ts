import { ValidationMessageType } from '../../ValidationMessageType';
import { MessageSchema } from '../interface/MessageSchema';

export const thesisMessages : MessageSchema = {
  'title' : ValidationMessageType.getStringInstance(true , 10 , 200 , false , true , 'String') ,
  'price' : ValidationMessageType.getIntegerInstance(true , 1 , 12 , false , true , 'Number') ,
  'content' : ValidationMessageType.getStringInstance(true , 1 , 5000 , false , true , 'String') ,
  'number_of_page' : ValidationMessageType.getStringInstance(true , 1 , 5 , false , true , 'String') ,
  'grade' : ValidationMessageType.getStringInstance(true , 1 , 2 , false , true , 'String') ,
  'department' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'faculty' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'supervisor' : ValidationMessageType.getStringInstance(true , 10 , 50 , false , true , 'String') ,
  'publisher' : ValidationMessageType.getIntegerInstance(true , 1 , 900000000 , false , true , 'Number or String') ,
  'slug' : ValidationMessageType.getStringInstance(true , 1 , 40 , false , true , 'String') ,
  'publication_year' : ValidationMessageType.getStringInstance(true , 4 , 4 , false , true , 'String') ,
  'user_id' : ValidationMessageType.getStringInstance(true , 1 , 200 , false , true , 'String') ,
  'author_name' : ValidationMessageType.getStringInstance(true , 1 , 50 , false , true , 'String') ,
  'status' : ValidationMessageType.getStringInstance(true , 1 , 900000000 , false , true , 'String') ,
  'cover_image' : ValidationMessageType.getStringInstance(true , 1 , 200 , false , true , 'String') ,
  'uploader_email_address' : ValidationMessageType.getStringInstance(true , 1 , 50 , false , true , 'String') ,
  'name_of_uploader' : ValidationMessageType.getStringInstance(true , 1 , 200 , false , true , 'String') ,
};