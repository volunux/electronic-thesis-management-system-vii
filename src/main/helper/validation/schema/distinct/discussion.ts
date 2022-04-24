import joi , { ObjectSchema } from 'joi';

export const discussionEntrySchema : ObjectSchema = joi.object().keys({
  'text' :  joi.string().min(1).max(500).trim(true).required().label('Text')
});
