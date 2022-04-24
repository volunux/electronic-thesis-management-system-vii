import joi , { ObjectSchema } from 'joi';

export class SchemaValidationFieldsFilter {

  public static filter(schema : ObjectSchema , allowableFields : string[]) : ObjectSchema {
    let fields : { [key : string] : any } = { };

    for (let field of allowableFields) { fields[field] = (<any>schema)['_ids']['_byKey'].get(field); }
    let entrySchema : ObjectSchema = joi.object().keys(fields);
    return entrySchema;
  }

}