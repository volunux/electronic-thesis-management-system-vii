import joi , { ObjectSchema } from 'joi';
import { ThesisValidationFields } from '../../fields/distinct/ThesisValidationFields';

export const userThesisUpdateEntrySchema : ObjectSchema = joi.object().keys({
  'title' : ThesisValidationFields.getTitle() ,
  'price' : ThesisValidationFields.getPrice() ,
  'number_of_page' : ThesisValidationFields.getNumberOfPage() ,
  'grade' : ThesisValidationFields.getGrade() ,
  'department' : ThesisValidationFields.getDepartment() ,
  'faculty' : ThesisValidationFields.getFaculty() ,
  'publisher' : ThesisValidationFields.getPublisher() ,
  'supervisor' : ThesisValidationFields.getSupervisor() ,
  'publication_year' : ThesisValidationFields.getPublicationYear() ,
  'user_id' : ThesisValidationFields.getUser() ,
  'author_name' : ThesisValidationFields.getAuthorName(50)
});
