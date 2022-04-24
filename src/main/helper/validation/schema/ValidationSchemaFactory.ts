import { ObjectSchema } from 'joi';
import { MessageSchema } from '../messages/interface/MessageSchema';
import { oneEntrySchema } from './shared/one';
import { roleEntrySchema } from './distinct/role';
import { threeEntrySchema } from './shared/three';
import { twoEntrySchema } from './shared/two';
import { departmentEntrySchema } from './distinct/department';
import { thesisEntrySchema } from './distinct/thesis';
import { userThesisEntrySchema } from './distinct/user-thesis';
import { userThesisUpdateEntrySchema } from './distinct/user-thesis-update';
import { userThesisDeleteEntrySchema } from './distinct/user-thesis-delete';
import { userThesisDeleteRequestEntrySchema } from './distinct/user-thesis-delete-request';
import { thesisContentUpdateEntrySchema } from './distinct/thesis-content-update';
import { thesisDetailEntrySchema } from './distinct/thesis-detail';
import { thesisDeleteRequestEntrySchema } from './distinct/thesis-delete-request';
import { userEntrySchema } from './distinct/user';
import { userCreateEntrySchema } from './distinct/user-create';
import { userDeleteEntrySchema } from './distinct/user-delete';
import { userDetailEntrySchema } from './distinct/user-detail';
import { userUpdateEntrySchema } from './distinct/user-update';
import { profileUpdateEntrySchema } from './distinct/profile-update';
import { userRoleUpdateEntrySchema } from './distinct/user-role-update';
import { displayEntrySchema } from './distinct/display';
import { orderUpdateEntrySchema } from './distinct/order-update';
import { discussionEntrySchema } from './distinct/discussion';
import { authenticationEntrySchema } from './distinct/authentication';
import { authenticationSignUpEntrySchema } from './distinct/authentication-sign-up';
import { checkoutEntrySchema } from './distinct/checkout';
import { forgotPasswordEntrySchema } from './distinct/forgot-password';
import { resetPasswordEntrySchema } from './distinct/reset-password';
import { passwordChangeEntrySchema } from './distinct/password-change';
import { emptyEntrySchema } from './empty-schema';

export class ValidationSchemaFactory {

  private static schemasTypeMap : Map<string, ObjectSchema | undefined> = new Map<string , ObjectSchema>();
  private static schemasMessageMap : Map<string, string | null | undefined> = new Map<string , string>();

  public static loadConfigurations() : void {

      this.setSchema('One' , oneEntrySchema , 'general');
      this.setSchema('Country' , this.schemasTypeMap.get('One') , this.schemasMessageMap.get('One'));
      this.setSchema('Faculty' , this.schemasTypeMap.get('One') , this.schemasMessageMap.get('One'));
      this.setSchema('Level' , this.schemasTypeMap.get('One') , this.schemasMessageMap.get('One'));
      
      this.setSchema('Three' , threeEntrySchema , null);
      this.setSchema('ThesisReply' , this.schemasTypeMap.get('Three') , 'general');
      this.setSchema('ThesisComment' , this.schemasTypeMap.get('Three') , 'general');
            
      this.setSchema('Two' , twoEntrySchema , 'general');
      this.setSchema('DeliveryMethod' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));
      this.setSchema('PaymentMethod' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));
      this.setSchema('Publisher' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));
      this.setSchema('ThesisGrade' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));

      this.setSchema('OrderStatus' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));
      this.setSchema('ThesisStatus' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));
      this.setSchema('UserStatus' , this.schemasTypeMap.get('Two') , this.schemasMessageMap.get('Two'));

      this.setSchema('Department' , departmentEntrySchema , 'general');
      this.setSchema('Role' , roleEntrySchema , 'general');
      this.setSchema('ProfileUpdate' , profileUpdateEntrySchema , 'user');
      this.setSchema('UserCreate' , userCreateEntrySchema , 'user');
      this.setSchema('UserUpdate' , userUpdateEntrySchema , 'user');
      this.setSchema('UserRoleUpdate' , userRoleUpdateEntrySchema , 'user');
      this.setSchema('UserDelete' , userDeleteEntrySchema , 'user');
      
      this.setSchema('Authentication' , authenticationEntrySchema , 'user');
      this.setSchema('AuthSignUp' , authenticationSignUpEntrySchema , 'user');
      this.setSchema('ForgotPassword' , forgotPasswordEntrySchema , 'forgotPassword');
      this.setSchema('ResetPassword' , resetPasswordEntrySchema , 'resetPassword');
      this.setSchema('PasswordChange' , passwordChangeEntrySchema , 'passwordChange');

      this.setSchema('Checkout' , checkoutEntrySchema , 'checkout');
      this.setSchema('DisplayType' , displayEntrySchema , 'display');
      this.setSchema('OrderUpdate' , orderUpdateEntrySchema , 'general');
      this.setSchema('Discussion' , discussionEntrySchema , 'discussion');

      this.setSchema('UserThesis' , userThesisEntrySchema , 'thesis');
      this.setSchema('UserThesisUpdate' , userThesisUpdateEntrySchema , 'thesis');
      this.setSchema('UserThesisDelete' , userThesisDeleteEntrySchema , 'thesis');
      this.setSchema('ThesisDeleteRequest' , thesisDeleteRequestEntrySchema , 'userThesisDeleteRequest');
      this.setSchema('UserThesisDeleteRequest' , userThesisDeleteRequestEntrySchema , 'userThesisDeleteRequest');
      this.setSchema('ThesisContentUpdate' , thesisContentUpdateEntrySchema , 'thesis');
      this.setSchema('ThesisDetail' ,  thesisDetailEntrySchema , 'thesis');
      this.setSchema('ThesisUpdate' , this.schemasTypeMap.get('UserThesisUpdate') , this.schemasMessageMap.get('UserThesisUpdate'));
      this.setSchema('ThesisDelete' , this.schemasTypeMap.get('UserThesisDelete') , this.schemasMessageMap.get('UserThesisDelete'));
      this.setSchema('Thesis' , thesisEntrySchema , 'thesis');
      this.setSchema('User' , userEntrySchema , 'user');
      this.setSchema('UserDetail' ,  userDetailEntrySchema , 'general');
  }

  public static setSchema(name : string , schema : ObjectSchema | undefined , messageCategory : string | null | undefined) {
    this.schemasTypeMap.set(name , schema);
    this.schemasMessageMap.set(name , messageCategory);
  }

  public static getSchema(entityName : string) : ObjectSchema { let schema : ObjectSchema | null | undefined = this.schemasTypeMap.get(entityName);
    if (schema !== null && schema !== undefined) { return schema; }
    else { return emptyEntrySchema; }
  }

  public static getMessageCategory(entityName : string) : string { let schema : string | null | undefined = this.schemasMessageMap.get(entityName);
    if (schema !== null && schema !== undefined) { return schema; }
    else { return ""; }
  }

  public static add(entityName : string , schema : ObjectSchema , messageType : string | null) : void { this.setSchema(entityName , schema , messageType); }
}