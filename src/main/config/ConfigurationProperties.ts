import dotenv from 'dotenv';
import ConfigFilePaths from './ConfigFilePaths';
import { EnvironmentPropertyException } from '../entity/error/EnvironmentPropertyException';

export default class ConfigurationProperties {

  private static instance: ConfigurationProperties;

  private constructor() { }

  public static getInstance(): ConfigurationProperties {
    if (!ConfigurationProperties.instance) {
      dotenv.config({ 'path': ConfigFilePaths.envDir });
      ConfigurationProperties.instance = new ConfigurationProperties();
    }
    return ConfigurationProperties.instance;
  }

  public getLogDir(): string { return this.getPropString('LOG_DIR'); }

  public getLogLevel(): string { return this.getPropString('LOG_LEVEL'); }

  public getDatabaseConnectionUrl(): string { return this.getPropString('DATABASE_URL'); }

  public getDatabaseType(): string { return this.getPropString('DATABASE_TYPE'); }

  public getPort(): number { return this.getPropInt('PORT'); }

  public getDatabaseName(): string { return this.getPropString('DATABASE_NAME'); }

  public getDatabaseHost(): string { return this.getPropString('DATABASE_HOST'); }

  public getDatabaseUsername(): string { return this.getPropString('DATABASE_USERNAME'); }

  public getDatabasePassword(): string { return this.getPropString('DATABASE_PASSWORD'); }

  public getDatabasePort(): number { return this.getPropInt('DATABASE_PORT'); }

  public getMaxNumberOfClient(): number { return this.getPropInt('DATABASE_MAX_NUMBER_OF_CLIENT'); }

  public getMaxNumberOfClientOrm(): number { return this.getPropInt('DATABASE_MAX_NUMBER_OF_CLIENT_ORM'); }

  public getIdleTimeoutMillis(): number { return this.getPropInt('DATABASE_IDLE_TIMEOUT_MILLIS'); }

  public getSessionSecret(): string { return this.getPropString('SESSION_SECRET'); }

  public getEmailAddress(): string { return this.getPropString('EMAIL_ADDRESS'); }

  public getFirstName(): string { return this.getPropString('FIRST_NAME'); }

  public getLastName(): string { return this.getPropString('LAST_NAME'); }

  public getPostBucket(): string { return this.getPropString('POSTS_BUCKET'); }

  public getS3UserSecretKey(): string { return this.getPropString('AREMIUSER_SECRET_KEY'); }

  public getS3UserAccessKey(): string { return this.getPropString('AREMIUSER_ACCESS_KEY'); }

  public getS3UserRegion(): string { return this.getPropString('AREMI_REGION'); }

  public getPaystackKey(): string { return this.getPropString('PAYSTACK'); }

  public getThesisDocBucket(): string { return this.getPropString('THESIS_DOC'); }

  public getThesisCoverImageBucket(): string { return this.getPropString('THESIS_COVER_IMAGE'); }

  public getThesisUserBucket(): string { return this.getPropString('THESIS_USER'); }

  public getRedisHost(): string { return this.getPropString('REDIS_HOST'); }

  public getRedisPort(): number { return this.getPropInt('REDIS_PORT'); }

  public getRedisAuthKey(): string { return this.getPropString('REDIS_AUTH'); }

  public getRedisUsername(): string { return this.getPropString('REDIS_USERNAME'); }

  public getRedisPassword(): string { return this.getPropString('REDIS_PASSWORD'); }

  public getAfricasTalkingKey(): string { return this.getPropString('AFRICASTALKING_APIKEY'); }

  public getAfricasTalkingUsername(): string { return this.getPropString('AFRICASTALKING_USERNAME'); }

  public getElksUsername(): string { return this.getPropString('ELKS_USERNAME'); }

  public getElksPassword(): string { return this.getPropString('ELKS_PASSWORD'); }

  public getMailgunDomain(): string { return this.getPropString('MAILGUN_DOMAIN'); }

  public getMailgunPrivateKey(): string { return this.getPropString('MAILGUN_API_PRIVATE'); }

  public getNexmoKey(): string { return this.getPropString('NEXMO_APIKEY'); }

  public getNexmoSecret(): string { return this.getPropString('NEXMO_APISECRET'); }

  public getSendgridKey(): string { return this.getPropString('SENDGRID_API_KEY'); }

  public getTwilioSid(): string { return this.getPropString('TWILIO_ACCOUNT_SID'); }

  public getTwilioAuthToken(): string { return this.getPropString('TWILIO_AUTH_TOKEN'); }

  public getTwilioPhoneNumber(): string { return this.getPropString('TWILIO_PHONE_NUMBER'); }

  public getTwilioPhoneNumberTrial(): string { return this.getPropString('TWILIO_PHONE_NUMBER'); }

  public getS3BucketName(bucketName: string): string { return this.getPropString(bucketName); }

  public getS3MaxRetries(): number { return this.getPropInt('S3_MAX_RETRY'); }

  public isS3ClockSkew(): boolean { return this.getPropBool('S3_CLOCK_SKEW'); }

  public getS3ConnectionTimeout(): number { return this.getPropInt('S3_CONNECTION_TIMEOUT'); }

  public getS3Timeout(): number { return this.getPropInt('S3_TIMEOUT'); }

  public getS3Urls(): string[] {
    let urls: string[] = [];
    urls.push(this.getPropString('S3_URL_V2'), this.getPropString('S3_URL_V3'), this.getPropString('S3_URL_V4'), this.getPropString('S3_URL_V5'), this.getPropString('S3_URL_V6'));
    return urls;
  }

  private getPropString(prop: string): string {
    let result: string = (<NodeJS.ProcessEnv>process.env)[prop] as string;
    if (result === undefined || result === null) throw new EnvironmentPropertyException('Environmental Property not found');
    return result;
  }

  private getPropInt(prop: string): number {
    let result: string = (<NodeJS.ProcessEnv>process.env)[prop] as string;
    if (result === undefined || result === null) throw new EnvironmentPropertyException('Environmental Property not found');
    return Number.parseInt(result);
  }

  public getPropBool(prop: string): boolean {
    let result: string = (<NodeJS.ProcessEnv>process.env)[prop] as string;
    if (result === undefined || result === null) throw new EnvironmentPropertyException('Environmental Property not found');
    return Boolean(result)
  }

}