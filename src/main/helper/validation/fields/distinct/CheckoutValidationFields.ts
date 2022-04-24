import joi , { NumberSchema , StringSchema } from 'joi';
import { SharedAllValidationFields } from '../shared/SharedAllValidationFields';

export class CheckoutValidationFields extends SharedAllValidationFields {

  static getFullName() : StringSchema { return joi.string().min(5).max(40).trim(true).required().label('Full Name'); }

  static getPhoneNumber() : StringSchema { return joi.string().min(1).max(15).required().label('Phone Number'); }

  static getCity() : StringSchema { return joi.string().min(1).max(25).trim(true).required().label('City'); }

  static getState() : StringSchema { return joi.string().min(1).max(25).required().label('State'); }

  static getAddress() : StringSchema { return joi.string().min(10).max(60).required().label('Contact Address'); }

  static getZip() : StringSchema { return joi.string().min(1).max(10).required().label('Postal Code'); }

  static getCountry() : NumberSchema { return this.relationId('Country'); }

  static getPaymentMethod() : NumberSchema { return this.relationId('Payment Method'); }

  static getDeliveryMethod() : NumberSchema { return this.relationId('Delivery Method') }

};