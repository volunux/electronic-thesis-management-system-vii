import { Express, Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import SimpleLogger from '../../../util/other/Logger';
import fileUpload, { UploadedFile } from 'express-fileupload';
import FileOptions from '../others/FileOptions';
import aws from 'aws-sdk';

export class ExpressFileUploader {

  private static fileSize: number;
  private static fieldName: string;
  private static bucketName: string;
  private s3: aws.S3;
  private s3Config: aws.S3;
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': ExpressFileUploader.name });

  constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) {
    this.s3Config = s3Instance;
    this.s3 = new aws.S3();
    aws.config.update(s3Configuration);
  }

  public static init(app: Express): void {
    app.use(fileUpload({
      'limits': { 'fileSize': 1024 * ExpressFileUploader.fileSize },
      'abortOnLimit': true
    }));
  }

  public static setFileSizeAndFieldName(fileSize: number, fieldName: string): void {
    ExpressFileUploader.fileSize = fileSize;
    ExpressFileUploader.fieldName = fieldName;
  }

  public static setBucketName(bucketName: string): void {
    ExpressFileUploader.bucketName = bucketName;
  }

  public async handleRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    const fieldName: string = ExpressFileUploader.fieldName;
    const uploadedFile: UploadedFile = (<any>req.files)[fieldName];
    try {
      const upload: aws.S3.ManagedUpload = new aws.S3.ManagedUpload({
        'params': {
          'Body': uploadedFile.data,
          'Key': FileOptions.generateUniqueFileName(uploadedFile.name),
          'ACL': 'public-read',
          'Bucket': ExpressFileUploader.bucketName
        },
        'service': this.s3
      });
      await upload.promise();
    }
    catch (err: any) { this.logger.error(err); }
  }

  public async handleRequestII(req: Request, res: Response, next: NextFunction): Promise<void> {
    const uploadedFile: UploadedFile = (<any>req.file);
    const fieldName: string = ExpressFileUploader.fieldName;
    try {
      const params: aws.S3.PutObjectRequest = {
        'Body': uploadedFile.data,
        'Key': FileOptions.generateUniqueFileName(uploadedFile.name),
        'ACL': 'public-read',
        'Bucket': ExpressFileUploader.bucketName
      };
      await this.s3.putObject(params).promise();
    }
    catch (err: any) { this.logger.error(err); }
  }

  public async handleRequestIII(req: Request, res: Response, next: NextFunction): Promise<void> {
    const fieldName: string = ExpressFileUploader.fieldName;
    const uploadedFile: UploadedFile = (<any>req.files)[fieldName];

    try {
      const params: aws.S3.PutObjectRequest = {
        'Body': uploadedFile.data,
        'Key': FileOptions.generateUniqueFileName(uploadedFile.name),
        'ACL': 'public-read',
        'Bucket': ExpressFileUploader.bucketName
      };
      await this.s3.upload(params).promise();
    }
    catch (err: any) { this.logger.error(err); }
  }

}