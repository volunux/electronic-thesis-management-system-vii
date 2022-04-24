import joi , { ObjectSchema } from 'joi';
import { SharedAllValidationFields } from '../../fields/shared/SharedAllValidationFields';

export const userThesisDeleteRequestEntrySchema : ObjectSchema = joi.object().keys({

		'message' : joi.string().min(10).max(500).required().label('Message') ,

		'thesis' : SharedAllValidationFields.relationId('Thesis') ,

		'requester_id' : SharedAllValidationFields.relationId('Requester')
});
