import { User } from '../../../entity/User';
import { Role } from '../../../entity/Role';
import { AuthenticationRepository } from '../../repository/AuthenticationRepository';
import { AuthenticationRepositoryImpl } from '../../repository/impl/AuthenticationRepositoryImpl';
import { AuthenticationService } from '../AuthenticationService'
import { RoleService } from '../../service/RoleService';
import { RoleServiceImpl } from '../../service/impl/RoleServiceImpl';

export class AuthenticationServiceImpl implements AuthenticationService {

  private readonly repository: AuthenticationRepository = new AuthenticationRepositoryImpl();
  private readonly roleService: RoleService = new RoleServiceImpl();

  public async userExists(userId: number): Promise<boolean> { return this.repository.userExists(userId); }

  public async addAccount(): Promise<User> { return this.repository.addAccount(); }

  public async save(entry: User): Promise<User | null> { return this.repository.save(entry); }

  public async saveRole(entry: User): Promise<User | null> { return this.repository.saveRole(entry); }

  public async findRole(userId: number): Promise<Role[]> { return this.roleService.findUserRoles(userId); }

  public async findUserSessionRole(userId: number): Promise<Role[]> { return this.roleService.findUserSessionRoles(userId); }

  public async findUserStatus(userId: number): Promise<string | null> { return this.repository.findUserStatus(userId); }

  public async relatedEntities(entry: User): Promise<User | null> { return this.repository.relatedEntities(entry); }

  public async existsEmailAddress(emailAddress: string): Promise<boolean> { return this.repository.existsEmailAddress(emailAddress); }

  public async existsUsername(username: string): Promise<boolean> { return this.repository.existsUsername(username); }

  public async existsLoginDetails(emailAddress: string): Promise<User | null> {
    let user: User | null = await this.repository.existsLoginDetails(emailAddress);
    let roles: Role[] = [];
    if (user !== null) {
      roles = await this.roleService.findUserSessionRoles(user !== null ? user.getId() : 0);
      user.setRoles(roles);
    }
    return user;
  }

  public async existsLoginDetailsById(id: number): Promise<User | null> { return this.repository.existsLoginDetailsById(id); }

  public async createForgotPasswordToken(emailAddress: string, token: string, tokenExpiryDate: string): Promise<User | null> {
    return this.repository.createForgotPasswordToken(emailAddress, token, tokenExpiryDate);
  }

  public async validateResetPasswordToken(token: string): Promise<User | null> { return this.repository.validateResetPasswordToken(token); }

  public async saveNewPassword(entry: User): Promise<User | null> { return this.repository.saveNewPassword(entry); }

}
