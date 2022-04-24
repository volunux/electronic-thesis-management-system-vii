import aws from 'aws-sdk';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import ConfigFilePaths from '../../../config/ConfigFilePaths';
import FileConfigurer from './FileConfigurer';

export default class FileConfigurerImpl implements FileConfigurer {

  protected constructor() {}

  private static instance : FileConfigurerImpl;
  private readonly eProps : ConfigurationProperties = ConfigurationProperties.getInstance();
  private s3Instance : aws.S3;
  private configuration : aws.S3.ClientConfiguration | aws.ConfigurationOptions = {
    'secretAccessKey' : this.eProps.getS3UserSecretKey() ,
    'accessKeyId' : this.eProps.getS3UserAccessKey() ,
    'region' : this.eProps.getS3UserRegion() ,
    'maxRetries' : this.eProps.getS3MaxRetries() ,
    'signatureVersion' : 'v4',
    'httpOptions' : {
      'timeout' : this.eProps.getS3Timeout() ,
      'connectTimeout' : this.eProps.getS3ConnectionTimeout() }
  };

  public static getInstance() : FileConfigurerImpl {
    if (!FileConfigurerImpl.instance) { FileConfigurerImpl.instance = new FileConfigurerImpl(); }
    return FileConfigurerImpl.instance; }

  public getS3Instance() : aws.S3 {
    if (!this.s3Instance) { this.s3Instance = new aws.S3(this.configuration);  }
    return this.s3Instance;
  }

  public getConfiguration() : aws.ConfigurationOptions {
    return this.configuration;
  }

}