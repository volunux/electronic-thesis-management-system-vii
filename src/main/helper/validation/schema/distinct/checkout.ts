import joi , { ObjectSchema } from 'joi';
import { CheckoutValidationFields } from '../../fields/distinct/CheckoutValidationFields';

export const checkoutEntrySchema : ObjectSchema = joi.object().keys({
  'full_name' : CheckoutValidationFields.getFullName() ,
  'phone_number' : CheckoutValidationFields.getPhoneNumber() ,
  'state' : CheckoutValidationFields.getState() ,
  'city' : CheckoutValidationFields.getCity() ,
  'country' : CheckoutValidationFields.getCountry() ,
  'contact_address' : CheckoutValidationFields.getAddress() ,
  'zip' : CheckoutValidationFields.getZip() ,
  'payment_method' : CheckoutValidationFields.getPaymentMethod() ,
  'delivery_method' : CheckoutValidationFields.getDeliveryMethod()
});
