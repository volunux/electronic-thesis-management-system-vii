import joi , { ObjectSchema } from 'joi';

export const orderUpdateEntrySchema : ObjectSchema = joi.object().keys({
  'status' : joi.number().min(1).max(900000000).required().label('Status')
});
