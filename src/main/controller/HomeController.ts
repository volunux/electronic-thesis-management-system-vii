    import async from 'async';
import crypto from 'crypto';
import fs from 'fs';
import { Logger } from 'winston';
import { Request, Response, NextFunction } from 'express';
import { IncomingHttpHeaders } from 'http';
import { PassportStatic } from 'passport';
import SimpleLogger from '../util/other/Logger';
import { LoginMaxAttemptException } from '../entity/error/LoginMaxAttemptException';
import { SessionConfig } from '../config/SessionConfig';
import { BaseController } from './abstract/BaseController';
import { User } from '../entity/User';
import { Country } from '../entity/Country';
import { RouteOptionsConfig } from '../route/config/RouteOptionsConfig';
import { UserHelper } from '../helper/entry/UserHelper';
import { MailMessage } from '../util/mail/MailMessage';
import { MailMessageImpl } from '../util/mail/MailMessageImpl';
import { MailSender } from '../util/mail/MailSender';
import { MailSenderServicesContainer } from '../util/mail/MailSenderServicesContainer';
import { AuthenticationService } from '../model/service/AuthenticationService';
import { AuthenticationServiceImpl } from '../model/service/impl/AuthenticationServiceImpl';
import { CountryService } from '../model/service/CountryService';
import { CountryServiceImpl } from '../model/service/impl/CountryServiceImpl';
import { MailHelper } from '../helper/middleware/MailHelper';

const passport: PassportStatic = require('passport');

export class HomeController extends BaseController {

  private readonly service: AuthenticationService = new AuthenticationServiceImpl();
  private readonly countryService: CountryService = new CountryServiceImpl();
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': HomeController.name });
  private mailSender: MailSender | null = MailSenderServicesContainer.getService('sendgrid');

  constructor(config: RouteOptionsConfig) {
    super(config);
    this.config = config;
  }

  public static setUser(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) { req.bindingModel = new User(req.body); }
    else { req.bindingModel = new User({}); }
    return next();
  }

  public static setForgotPassword(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) { req.bindingModel = { ...req.body }; }
    else { req.bindingModel = {}; }
    return next();
  }

  public static setPasswordChange(req: Request, res: Response, next: NextFunction): void {
    if (req.body !== null && req.body !== undefined) { req.bindingModel = { ...req.body }; }
    else { req.bindingModel = {}; }
    return next();
  }

  public dashboard(req: Request, res: Response, next: NextFunction): void { res.render(this.getBaseViewPath() + "dashboard"); }

  public more(req: Request, res: Response, next: NextFunction): void { res.render(this.getStaticBaseViewPath() + "more"); }

  public async contact(req: Request, res: Response, next: NextFunction): Promise<void> { res.render("pages/static/contact"); }

  public async about(req: Request, res: Response, next: NextFunction): Promise<void> { res.render("pages/static/about"); }

  public async signIn(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "sign-in", { 'entry': new User({}) }); }

  public async signInAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user: User = <User>req.bindingModel;
    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + "sign-in", { 'entry': user });
      return;
    }

    let context: HomeController = this;
    passport.authenticate('local-signin', { 'failureFlash': true, 'session': true }, async function(err: any, signedIn: any, info: any) {
      if (signedIn === false) {
        req.validationErrors.addError(info.message);
        (<any>req.session).loginAttempt = ++(<any>req.session).loginAttempt;
        return res.render(context.getBaseViewPath() + "sign-in", { 'entry': new User({}) });
      }

      let sessionData = req.session;
      req.login(signedIn, () => {
        req.session.regenerate((err: any): void => {
          Object.assign(req.session, sessionData);
          if ((<any>req.session).loginAttempt !== null || (<any>req.session).loginAttempt !== undefined) (<any>req.session).loginAttempt = 0;
          req.flash('success', 'Authentication successful.');
          let userUrlIntent: string = (<any>req.session).userUrlIntent;

          if (userUrlIntent) {
            delete (<any>req.session).userUrlIntent;
            return res.redirect(userUrlIntent);
          }
          return res.redirect('/dashboard');
        });
      });
    })(req, res, next);
  }

  public async signOut(req: Request, res: Response, next: NextFunction): Promise<void> {
    req.logOut();
    req.session.destroy((err: Error) => {
      if (err) this.logger.error(err);
      res.redirect('/');
    });
  }

  public async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user: User = await this.service.addAccount();
    let countries: Country[] = [];
    if (user !== null) { countries = await this.countryService.selectOnlyNameAndId(); }
    if (countries.length < 1) { throw new Error("An error has occured."); }
    res.render(this.getBaseViewPath() + "sign-up", { 'entry': user, 'countries': countries });
  }

  public async signUpAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    let user: User = <User>req.bindingModel;
    let countries: Country[] = [];

    if (req.validationErrors.isEmpty() === false) {
      let userCreate: User = await this.service.addAccount();
      if (userCreate !== null) { countries = await this.countryService.selectOnlyNameAndId(); }
      if (countries.length < 1) { throw new Error("An error has occured."); }
      return res.render(this.getBaseViewPath() + "sign-up", { 'entry': user, 'countries': countries });
    }

    let context: HomeController = this;
    passport.authenticate('local-signup', { 'failureFlash': true, 'session': true }, async function(err: any, userCreated: any, info: any): Promise<any> {

      if (userCreated === false) {
        req.validationErrors.addError(info.message);
        let userCreate: User = await context.service.addAccount();
        if (userCreate !== null) { countries = await context.countryService.selectOnlyNameAndId(); }
        if (countries.length < 1) { throw new Error("An error has occured."); }
        return res.render(context.getBaseViewPath() + "sign-up", { 'entry': user, 'countries': countries });
      }

      let datas: { [key: string]: any } = {
        'email_address': user.getEmailAddress(),
        'password': user.getPassword()
      };
      let mailMessage: MailMessage = new MailMessageImpl("Account Created Successfully", "");
      MailHelper.renderTemplateAndSend(res, "templates/welcome", context.mailSender, mailMessage, <any>user, datas);
      let sessionData = req.session;

      req.login(userCreated, () => {
        req.session.regenerate((err: any): void => {
          Object.assign(req.session, sessionData);
          req.flash('success', 'Account creation successful.');
          return res.redirect('/dashboard');
        });
      });
    })(req, res, next);

  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> { res.render(this.getBaseViewPath() + "forgot-password"); }

  public async forgotPasswordConfirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    let entry: any = req.body;
    let context: HomeController = this;
    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + "forgot-password", { 'entry': entry });
      return;
    }

    async.waterfall([
      async function createToken(done: (err: Error | null, token: string) => void): Promise<void> {
        crypto.randomBytes(20, (err: Error | null, buf: Buffer) => {
          let token: string = buf.toString('hex');
          done(err, token);
        });
      },
      async function saveRandomToken(token: string, done: (err: Error | null, token: string, user: any) => void): Promise<void> {
        let emailAddress: string = req.body.email_address;
        let emailAddressExists: boolean = await context.service.existsEmailAddress(emailAddress ? emailAddress : "undefined");
        let error: any;
        let user: User | null = null;
        let tokenExpiryDate: string = (Date.now() + 3600000).toString();

        if (emailAddressExists === true) {
          try { user = await context.service.createForgotPasswordToken(emailAddress, token, tokenExpiryDate); }
          catch (err: any) { error = err; }
          done(error, token, user);
        }
        else {
          req.validationErrors.addError("No account or profile with that email address exists in the record.");
          res.render(context.getBaseViewPath() + "forgot-password", { 'entry': entry });
        }
      },

      async function deliverForgotPasswordMessage(token: string, user: User, done: (err: Error | null, user: User) => void): Promise<void> {

        let datas: { [key: string]: any } = {
          'token': token,
          'host': (<IncomingHttpHeaders>req.headers).host as string
        };
        let mailMessage: MailMessage = new MailMessageImpl('Password Reset Notification', "");
        MailHelper.renderTemplateAndSend(res, "templates/forgot-password", context.mailSender, mailMessage, <any>user, datas);
        done(null, user);
      }],

      async function confirmDelivery(err: Error | null | undefined, user: unknown): Promise<void> {
        if (err) throw new Error('Error has occured');
        req.flash('success', "Forgot password email has been sent.");
        return res.redirect(context.backToHome());
      });
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    let resetPasswordToken: string = req.params.token;

    if (resetPasswordToken === undefined && resetPasswordToken === null) {
      req.validationErrors.addError("You need to provide a forgot password token");
      return res.render(this.getBaseViewPath() + "forgot-password");
    }

    let user: User | null = await this.service.validateResetPasswordToken(resetPasswordToken);
    if (user === null) {
      req.validationErrors.addError("Forgot password token has expired. You have to request for a new one.");
      res.render(this.getBaseViewPath() + "forgot-password");
    }
    else { res.render(this.getBaseViewPath() + "reset-password"); }
  }

  public async saveNewPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    let resetPasswordToken: string = req.params.token;
    let entry: any = req.body;
    let context: HomeController = this;
    if (resetPasswordToken === undefined && resetPasswordToken === null) {
      req.validationErrors.addError("You need to provide a forgot password token");
      return res.render(this.getBaseViewPath() + "forgot-password");
    }
    if (req.validationErrors.isEmpty() === false) {
      res.render(this.getBaseViewPath() + "reset-password", { 'entry': entry });
      return;
    }

    async.waterfall([
      async function saveNewPassword(done: (err: Error | null, user: User) => void): Promise<void> {
        let token: string = req.params.token;
        let user: User | null = await context.service.validateResetPasswordToken(token);

        if (user === null) {
          let errors: string[] = ["Forgot password token has expired. You have to request for a new one."];
          return res.render(context.getBaseViewPath() + "forgot-password");
        }

        (<User>user).setPassword(entry.password);
        UserHelper.setPassword(user);
        user = await context.service.saveNewPassword(user);

        if (user !== null) { done(null, user); }
      },

      async function sendChangePasswordMessage(user: User, done: (err: Error | null, user: User) => void): Promise<void> {

        let datas: { [key: string]: any } = {
          'full_name': user.getFirstName() + ' ' + user.getLastName(),
          'host': (<IncomingHttpHeaders>req.headers).host as string
        };
        let mailMessage: MailMessage = new MailMessageImpl("Password Reset Successfully , You can sign in now", "");
        MailHelper.renderTemplateAndSend(res, "templates/reset-password-success", context.mailSender, mailMessage, <any>user, datas);
        done(null, user);
      }],

      async function changesDone(err: Error | null | undefined, user: unknown): Promise<void> {
        if (err) {
          let errors: string[] = ["Forgot password token has expired. You have to request for a new one."];
          res.render(context.getBaseViewPath() + "forgot-password");
        }
        else {
          req.flash('success', "Password successfully changed and updated.");
          return res.redirect('/');
        }
      });
  }

  protected getBaseViewPath(): string { return "pages/distinct/authentication/"; }

  protected backToEntries(): string { return "/profile"; }

  protected backToHome(): string { return "/"; }


}