import { User } from '../../entity/User';

export interface AuthenticationRepository {

  addAccount(): Promise<User>;
  userExists(userId: number): Promise<boolean>;
  existsEmailAddress(emailAddress: string): Promise<boolean>;
  existsUsername(username: string): Promise<boolean>;
  existsLoginDetails(emailAddress: string): Promise<User | null>;
  existsLoginDetailsById(id: number): Promise<User | null>;
  save(entry: User): Promise<User | null>;
  saveRole(entry: User): Promise<User | null>;
  findUserStatus(userId: number): Promise<string | null>;
  relatedEntities(entry: User): Promise<User | null>;
  createForgotPasswordToken(emailAddress: string, token: string, tokenExpiryDate: string): Promise<User | null>;
  validateResetPasswordToken(token: string): Promise<User | null>;
  saveNewPassword(entry: User): Promise<User | null>;
} 