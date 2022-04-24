import joi , { ObjectSchema } from 'joi';

export const emptyEntrySchema : ObjectSchema = joi.object().keys({ });