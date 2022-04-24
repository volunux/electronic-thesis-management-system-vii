import { ValidationResult , ValidationErrorItem } from 'joi';
import { ValidationErrorMessage } from './ValidationErrorMessage';
import { validationMessageList } from './messages/list';

export class ValidationMessageBuilder {

  public static build(err : ValidationResult , schemaType : string) : ValidationErrorMessage[] {

      let validationErrorList : ValidationErrorMessage[] = [];

      if (err && err.error && err.error.details) { 
        let $details : ValidationErrorItem[] = err.error.details;
        let itemAdded = false;
        validationErrorList = ValidationErrorMessage.getInstance($details.length);

        for (let i in $details) {
          let validationErrorItem : ValidationErrorItem = $details[i];
          let type = validationErrorItem.type.split('.');
          if (type[0] == 'array') {
            if (itemAdded == false) {
              itemAdded = true;
            let $context : any;
            if ($context = (validationErrorItem.context !== undefined || validationErrorItem.context !== null ? validationErrorItem.context : $context)) {
              validationErrorList[i].setMessage($context.label + ' ' + validationMessageList[schemaType][validationErrorItem.path[0]][type[0]][type[1]]);
              validationErrorList[i].setPath($context.key); 
              validationErrorList[i].setFieldName($context.label); } } }
          else {
            let $context : any;
            if ($context = (validationErrorItem.context !== undefined || validationErrorItem.context !== null ? validationErrorItem.context : $context)) {
              if (validationMessageList[schemaType][$context.key] !== undefined) {
                validationErrorList[i].setMessage($context.label + ' ' + validationMessageList[schemaType][$context.key][type[0]][type[1]]);
                validationErrorList[i].setPath($context.key); 
                validationErrorList[i].setFieldName($context.label); } } } }  }
      return validationErrorList;
  }

  public static transformValidationErrorsToArrayOfString(validationErrorMessages : ValidationErrorMessage[]) : string[] {
    let transformErrorList : string[] = validationErrorMessages.map((item : ValidationErrorMessage) => { return item.getMessage(); });
    return transformErrorList;
  } 

}