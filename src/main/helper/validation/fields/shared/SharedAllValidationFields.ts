import joi , { NumberSchema , StringSchema } from 'joi';

export class SharedAllValidationFields {

  static getName() : StringSchema { return joi.string().min(1).max(150).trim(true).required().label('Name'); } 

  static getTitle() : StringSchema { return joi.string().min(1).max(150).trim(true).optional().label('Title'); }

  static getWord() : StringSchema { return joi.string().min(3).max(20).trim(true).required().label('Word'); }

  static getAbbreviation() : StringSchema { return joi.string().min(2).max(8).trim(true).required().label('Abbeviation'); }

  static getDescription(min? : number , max? : number) : StringSchema { return joi.string().min(min ? min : 10).max(max ? max : 300).trim(true).optional().allow('').label( 'Description'); } 

  static getSlug() : StringSchema { return joi.string().min(1).max(40).trim(true).optional().label('Permalink'); }

  static getAuthor() : NumberSchema { return this.relationId('Author'); }

  static getStatus() : NumberSchema { return this.relationId('Status'); }

  static getEmailAddress(label? : string , min? : number , max? : number) : StringSchema { return joi.string().min(min ? min : 1).max(max ? max : 50)

    .pattern(/^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/).required().label(label ? label : 'Email Address') }

  static getAuthorName(max? : number) : StringSchema { return joi.string().min(1).max(max ? max : 200).required().trim(true).label('Author Name'); }

  static relationId(label? : string) : NumberSchema { return joi.number().min(1).max(900000000).required().label(label ? label : 'Relation') } 

};