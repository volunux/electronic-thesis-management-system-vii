import { Attachment } from '../../entity/Attachment';
import { User } from '../../entity/User';
import { CrudRepositoryX } from './generic/CrudRepositoryX';

export interface ProfileRepository extends CrudRepositoryX<User> {

  saveUserObject(entry: Attachment, entityName: string): Promise<Attachment | null>;
  existsUserObject(id: number, entityName: string): Promise<Attachment | null>;
  deleteUserObject(id: number, entityName: string): Promise<Attachment | null>;
  deleteUserObjectByKey(key: string, entityName: string): Promise<Attachment | null>;
  updateStatus(id: number, status: string): Promise<User | null>;
  updateOneStatus(id: number): Promise<User | null>;
} 