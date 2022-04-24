import { CrudServiceX } from './abstract/CrudServiceX';
import { UserProfilePhoto } from '../../entity/UserProfilePhoto';
import { UserSignature } from '../../entity/UserSignature';
import { User } from '../../entity/User';
import { Attachment } from '../../entity/Attachment';

export interface ProfileService extends CrudServiceX<User> {
  existsUserObject(id : number , entityName : string) : Promise<Attachment | null>;
  saveUserObject(id : number , entityName : string , entry : Attachment) : Promise<Attachment | null>;
  updateUserObject(id : number , entityName : string , entry : Attachment | null , bucketName : string) : Promise<Attachment | null>;
  deleteUserObjectByKey(key : string , entityName : string , bucketName : string) : Promise<Attachment | null>;
  deleteUserObject(id : number , entityName : string , bucketName : string) : Promise<Attachment | null>;
  updateOneStatus(id : number) : Promise<User | null>;
  updateStatus(id : number , status : string) : Promise<User | null>;
}