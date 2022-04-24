import { allMessages } from './shared/all';
import { thesisMessages } from './distinct/thesis';
import { userMessages } from './distinct/user';
import { displayMessage } from './distinct/display';
import { discussionMessage } from './distinct/discussion';
import { checkoutMessages } from './distinct/checkout';
import { forgotPasswordMessages } from './distinct/forgot-password';
import { userThesisDeleteRequestMessages } from './distinct/user-thesis-delete-request';

export const validationMessageList : { [key : string] : any } = {
  'general' : { ...allMessages } ,
  'thesis' : { ...thesisMessages } ,
  'user' : { ...allMessages , ...userMessages } ,
  'display' : { ...displayMessage } ,
  'checkout' : { ...checkoutMessages , ...allMessages } ,
  'forgotPassword' : {...allMessages ,  ...forgotPasswordMessages } ,
  'resetPassword' : { ...allMessages , ...userMessages} ,
  'passwordChange' : { ...allMessages , ...userMessages} ,
  'userThesisDeleteRequest' : { ...allMessages , ...userThesisDeleteRequestMessages } ,
  'discussion' : {...allMessages , ...discussionMessage}
}