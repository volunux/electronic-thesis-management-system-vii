import joi , { StringSchema } from 'joi';
import { PasswordValidationFields } from './PasswordValidationFields';

export class UserCreateValidationFields extends PasswordValidationFields { };