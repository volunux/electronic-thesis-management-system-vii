import { CrudRepositoryX } from './generic/CrudRepositoryX';
import { User } from '../../entity/User';
import { UserRole } from '../../entity/UserRole';
import { Attachment } from '../../entity/Attachment';

export interface UserRepository extends CrudRepositoryX<User> {

  entryExists(id: string, userId?: number): Promise<User | null>;
  updateOneRole(id: number): Promise<User | null>;
  updateRole(entries: UserRole[]): Promise<void>;
  deleteRole(id: number, entry: User): Promise<void>;
  checkUsername(username: string): Promise<boolean>;
  checkEmailAddress(emailAddress: string): Promise<boolean>;
  checkMatricNumber(matricNumber: string): Promise<boolean>;
  findObject(entry: string, entityName: string): Promise<Attachment | null>;
  findManyObject(entries: string | string[], entityName: string): Promise<Attachment[]>;
  findFullNameAndOthers(id: number): Promise<User | null>;
  updateStatus(id: number, status: string): Promise<boolean>;
} 