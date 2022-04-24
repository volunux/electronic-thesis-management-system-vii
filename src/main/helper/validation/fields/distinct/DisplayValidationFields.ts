import joi , { StringSchema } from 'joi';

export class DisplayValidationFields {

  static getDisplayType() : StringSchema { return joi.string().min(1).max(150).trim(true).required().valid('logo' , 'thesis-cover-image' , 'favicon' , 'profile').label('Display Type'); }
};