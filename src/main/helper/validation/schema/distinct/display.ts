import joi , { ObjectSchema } from 'joi';
import { DisplayValidationFields } from '../../fields/distinct/DisplayValidationFields';

export const displayEntrySchema : ObjectSchema = joi.object().keys({
  'display_type' : DisplayValidationFields.getDisplayType()
});
