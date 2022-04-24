import { Request, Response, NextFunction } from 'express';
import { SessionConfig } from '../../config/SessionConfig';
import { UserSession } from '../../entity/UserSession';
import { User } from '../../entity/User';
import { Department } from '../../entity/Department';
import { UserService } from '../../model/service/UserService';
import { UserServiceImpl } from '../../model/service/impl/UserServiceImpl';
import { DepartmentService } from '../../model/service/DepartmentService';
import { DepartmentServiceImpl } from '../../model/service/impl/DepartmentServiceImpl';
import { LoginMaxAttemptException } from '../../entity/error/LoginMaxAttemptException';

export class UserProfile {

  public static setUserProfile(req: Request, res: Response, next: NextFunction): void {
    if (req.user) { (<any>req.user) = new UserSession(req.user); }
    return next();
  }

  public static isAuthenticated(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) { return next(); }
    else {
      (<any>req.session).userUrlIntent = res.locals.requestUrl;
      req.validationErrors.addError('You need to sign in before you can perform an action');
      return res.render('pages/distinct/authentication/sign-in');
    }
  }

  public static async checkUsernameAndEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userService: UserService = new UserServiceImpl();
    let msgList: string[] = [];
    if (req.validationErrors.isEmpty()) {
      try {
        await userService.checkUsername((<User>req.bindingModel).getUsername()) ? msgList.push("Username already exists and cannot be used.") : void 0;
        if (msgList.length <= 0) await userService.checkEmailAddress((<User>req.bindingModel).getEmailAddress()) ? msgList.push("Email Address already exists and cannot be used.") : void 0;
      }
      catch (err: any) { throw new Error("Error has occured."); }
    }
    req.validationErrors.addManyError(msgList);
    return next();
  }

  public static async checkMatricNumber(req: Request, res: Response, next: NextFunction): Promise<void> {
    let userService: UserService = new UserServiceImpl();
    let msgList: string[] = [];
    if (req.validationErrors.isEmpty()) {
      try { if (msgList.length <= 0) (await userService.checkMatricNumber((<User>req.bindingModel).getMatriculationNumber())) ? msgList.push("Matriculation Number already exists and cannot be used.") : void 0; }
      catch (err: any) { throw new Error("Error has occured."); }
    }
    req.validationErrors.addManyError(msgList);
    return next();
  }

  public static async verifyDepartmentAndFaculty(req: Request, res: Response, next: NextFunction): Promise<void> {
    let departmentService: DepartmentService = new DepartmentServiceImpl();
    let user: any | null = <any>req.bindingModel;
    let msgList: string[] = [];
    let department: Department | null = null;
    let departmentId: number = +(<any>req.bindingModel).getDepartmentId();

    if (req.validationErrors.isEmpty()) {
      try {
        departmentId ? void 0 : msgList.push("Invalid Department Identity Number.");
        if (departmentId > 0) department = await departmentService.verifyDepartment(departmentId);

        if (department !== null && +(department!.getFacultyId()) !== +(user!.getFacultyId())) { msgList.push("Department does not belong to the choosen faculty."); }
        else if (department === null) { msgList.push("Department does not exists and cannot be used."); }
      }
      catch (err: any) { throw new Error("Error has occured."); }
    }
    req.validationErrors.addManyError(msgList);
    return next();
  }

  public static noAuthentication(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) { return res.redirect('/profile/'); }
    else { return next(); }
  }

  public static isUserLoggedIn(req: Request, res: Response, next: NextFunction): void {
    if (req.user !== null && req.user !== undefined) { res.locals.isUserLoggedIn = true; }
    else { res.locals.isUserLoggedIn = false; }
    return next();
  }

  public static loginAttempt(req: Request, res: Response, next: NextFunction): void {
    if ((<any>req.session).loginAttempt > 3 && (<any>req.cookies).max_login_attempt === undefined || (<any>req.cookies).max_login_attempt === null) {
      res.cookie('max_login_attempt', true, SessionConfig.getSessionOptions(60 * 60 * 7));
      (<any>req.session).loginAttempt = 0;
      throw new LoginMaxAttemptException();
    }
    else if ((<any>req.cookies).max_login_attempt) { throw new LoginMaxAttemptException(); }
    return next();
  }

  public static logOut(req: Request, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) { return next(); }
    else { UserProfile.isAuthenticated(req, res, next); }
  }

}