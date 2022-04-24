import { Express, Request, Response, NextFunction, CookieOptions } from 'express';
import { PassportStatic } from 'passport';
import { PassportConfig } from './PassportConfig';
import ConfigurationProperties from './ConfigurationProperties';
import RedisCacheManager from '../util/cache/RedisCacheManager';
import redis from 'redis';
import store, { Client, RedisStore } from 'connect-redis';

const passport: PassportStatic = require('passport');
const session = require('express-session');
const flash = require('express-flash');

export class SessionConfig {

  private static eProps: ConfigurationProperties = ConfigurationProperties.getInstance();

  static init(app: Express): void {

    const cacheManager: RedisCacheManager = RedisCacheManager.getInstance();
    cacheManager.init();
    const redisStore: RedisStore = store(session);

    app.use(session({
      'store': new redisStore({ 'client': cacheManager.getClient() }),
      'name': 'JSESSIONID',
      'secret': this.eProps.getSessionSecret(),
      'saveUninitialized': true,
      'resave': false,
      'cookie': SessionConfig.getSessionOptions()
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());

    PassportConfig.init(passport);
    PassportConfig.signIn(passport);
    PassportConfig.signUp(passport);
  }

  static getSessionOptions(maxAge?: number): CookieOptions {
    if (!maxAge) maxAge = 24 * 60 * 60 * 7000;
    return { 'path': '/', 'httpOnly': true, 'maxAge': maxAge, 'secure': false, 'sameSite': 'lax' }
  }
}