import { CrudServiceX } from './abstract/CrudServiceX';
import { EntityQueryConfig } from '../query/util/EntityQueryConfig';
import { User } from '../../entity/User';

export interface UserService extends CrudServiceX<User> {
  entryExists(id : string , userId? : number) : Promise<User | null>;
  updateOneRole(id : number) : Promise<User | null>;
  updateRole(entry : User) : Promise<void>;
  deleteRole(id : number , user : User) : Promise<void>; 
  updateAndDeleteRole(id : number , user : User) : Promise<boolean>; 
  checkUsername(username : string) : Promise<boolean>;
  checkEmailAddress(emailAddress : string) : Promise<boolean>;
  checkMatricNumber(matricNumber : string) : Promise<boolean>;
  findFullNameAndOthers(id : number) : Promise<User | null>;
  updateStatus(id : number, status : string) : Promise<boolean>;
}