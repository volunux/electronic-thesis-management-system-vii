import joi , { ObjectSchema } from 'joi';
import { ThesisValidationFields } from '../../fields/distinct/ThesisValidationFields';

export const userThesisDeleteEntrySchema : ObjectSchema = joi.object().keys({
  'title' : ThesisValidationFields.getTitle() ,
  'number_of_page' : ThesisValidationFields.getNumberOfPage() ,
  'publication_year' : ThesisValidationFields.getPublicationYear() ,
  'author_name' : ThesisValidationFields.getAuthorName(50) 
});
