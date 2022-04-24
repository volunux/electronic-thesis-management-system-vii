import { Express } from 'express';
import helmet from 'helmet';
import ConfigurationProperties from './ConfigurationProperties';

export class ContentSecurityPolicyConfigurer {

  private static eProps: ConfigurationProperties = ConfigurationProperties.getInstance();

  public static init(app: Express): void {
    app.use(helmet());
    app.use(helmet.contentSecurityPolicy({
      'directives': {
        'img-src': ["'self'", "'unsafe-inline'", "blob:", "s3.amazonaws.com", ...this.eProps.getS3Urls()],
        'script-src': ["'self'", "*.amazonaws.com", "s3.amazonaws.com", "svc.webspellchecker.net", "'unsafe-inline'", ...this.eProps.getS3Urls()],
        'style-src': ["'self'", "'unsafe-inline'", "*.amazonaws.com", "s3.amazonaws.com"],
        'default-src': ["'self'", "'unsafe-inline'", "blob:", "s3.amazonaws.com", "svc.webspellchecker.net", ...this.eProps.getS3Urls()]
      }
    }));
  }

}