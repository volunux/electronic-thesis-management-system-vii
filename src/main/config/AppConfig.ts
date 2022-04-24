import express, { Express, RequestHandler } from 'express';
import dotenv from 'dotenv';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import moment from 'moment';
import flash from 'express-flash';
import { Logger } from 'winston';

import ConfigurationProperties from './ConfigurationProperties';
import DBConnection from '../config/db/DBConnection';
import OrmDBConnection from '../config/db/OrmDBConnection';
import ConfigFilePaths from './ConfigFilePaths';
import SimpleLogger from '../util/other/Logger';
import FileConfigurerImpl from '../util/aws/s3/FileConfigurerImpl';
import { morganFormat } from '../util/other/logging-settings';
import { AppRouter } from '../route/AppRouter';
import { SessionConfig } from './SessionConfig';
import { RequestRateLimitConfig } from './RequestRateLimitConfig';
import { CartConfig } from './shop/CartConfig';
import { TemplateEngineConfig } from './TemplateEngineConfig';
import { ContentSecurityPolicyConfigurer } from './ContentSecurityPolicyConfigurer';
import { InternalRoute } from './InternalRoute';
import { GlobalErrorHandler } from './GlobalErrorHandler';
import { ObjectSweepJob } from '../util/job/ObjectSweepJob';
import { DataAccessException } from '../entity/error/DataAccessException';


const nocache = require("nocache");

export class AppConfig {

  private static readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private static readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': AppConfig.name });

  static init(app: Express): void {
    const PORT: number = this.eProps.getPort() || 8080;
    DBConnection.connect();
    try { OrmDBConnection.initializeConnection(); } catch (err: any) { throw new DataAccessException(); }
    ObjectSweepJob.getInstance().execute();
    FileConfigurerImpl.getInstance();

    const morganMiddleware: RequestHandler = logger(morganFormat, { 'stream': { 'write': (message) => this.logger.http(message.trim()) } })

    TemplateEngineConfig.init(app);

    app.set('x-powered-by', false);
    app.set('strict routing', false);

    app.use(nocache());
    app.use(compression());
    ContentSecurityPolicyConfigurer.init(app);
    app.use(cors());
    app.use(morganMiddleware);
    app.use(express.json());
    app.use(express.urlencoded({ 'extended': true }));
    app.use(cookieParser());
    app.use(express.static(ConfigFilePaths.staticDir, { 'maxAge': 1209600 }));
    SessionConfig.init(app);
    app.use(flash());
    CartConfig.init(app);
    RequestRateLimitConfig.init(app);

    InternalRoute.init(app);

    AppRouter(app);
    GlobalErrorHandler.init(app);

    app.listen(PORT, () => this.logger.info(`Running on ${PORT}`));

  }
}