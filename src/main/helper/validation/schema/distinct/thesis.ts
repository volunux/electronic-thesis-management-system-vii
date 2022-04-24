import joi , { ObjectSchema } from 'joi';
import { ThesisValidationFields } from '../../fields/distinct/ThesisValidationFields';

export const thesisEntrySchema : ObjectSchema = joi.object().keys({
  'title' : ThesisValidationFields.getTitle() ,
  'price' : ThesisValidationFields.getPrice() ,
  'content' : ThesisValidationFields.getContent() ,
  'number_of_page' : ThesisValidationFields.getNumberOfPage() ,
  'grade' : ThesisValidationFields.getGrade() ,  
  'department' : ThesisValidationFields.getDepartment() ,
  'faculty' : ThesisValidationFields.getFaculty() ,
  'supervisor' : ThesisValidationFields.getSupervisor() ,
  'publisher' : ThesisValidationFields.getPublisher() ,
  'publication_year' : ThesisValidationFields.getPublicationYear() ,
  'user_id' : ThesisValidationFields.getAuthor() ,
  'author_name' : ThesisValidationFields.getAuthorName(50)
});
