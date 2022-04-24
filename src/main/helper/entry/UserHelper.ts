import crypto from 'crypto';
import { User } from '../../entity/User';
import { Role } from '../../entity/Role'
import { UserStatus } from '../../entity/UserStatus';
import { UserSession } from '../../entity/UserSession';

export class UserHelper {

  /**
   * It sets the object whose type is User the hash and salt property values using the setter properties
   * @param {User} user - Takes an instance object of type User or an object whose prototype chain includes class User
   * @returns {void} No value is returned
   *  
   */  
  public static setPassword(user: User): void {
    let salt: string = crypto.randomBytes(16).toString('hex');
    let hash: string = crypto.pbkdf2Sync(user.getPassword(), salt, 1000, 64, 'sha512').toString('hex');
    user.setSalt(salt);
    user.setHash(hash);
  }

  /**
   * @param {any[]} entryValue - Takes an array of objects, filter them and returns an array of strings whose value is made up of the key 
   * that was passed in the original argument.  
   * @param {string} key - The value which is used to filter the array and whose values is returned. 
   * @returns {string[]} - It returns an array of strings
   */
  public static jsonArrayFlattener(entryValue: any[], key: string): string[] {
    if (!(entryValue instanceof Array)) return [];
    else { return entryValue.map((item) => { return item[key]; }); }
  }

    /**
   * @param {any[]} entryValue - Takes an array of objects, filter them and returns an array of strings whose value is made up of the key 
   * that was passed in the original argument.  
   * @param {string} key - The value which is used to filter the array and whose values is returned. 
   * @returns {number[]} - It returns an array of strings
   */
  public static jsonArrayFlattenerInt(entryValue: any[], key: string): number[] {
    if (!(entryValue instanceof Array)) return [];
    else { return entryValue.map((item) => { return +(item[key]); }); }
  }

  public static validPassword(password: any, user: UserSession | User): boolean {
    let hash: string = crypto.pbkdf2Sync(password, user.getSalt(), 1000, 64, 'sha512').toString('hex');
    return user.getHash() === hash;
  }

  public static getUserRoles(roles: Role[]): string[] {
    let transformedRoles: string[] = roles.map(function(role: Role): string { return role.getName(); });
    return transformedRoles;
  }

  public static getUserStatus(status: UserStatus): string {
    if (status === null) return "";
    return status.getName();
  }

}