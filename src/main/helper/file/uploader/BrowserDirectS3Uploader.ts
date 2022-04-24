import { Request, Response, RequestHandler, NextFunction } from 'express';
import { Logger } from 'winston';
import SimpleLogger from '../../../util/other/Logger';
import FileOptions from '../others/FileOptions';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import fs from 'fs';
import aws from 'aws-sdk';

export class BrowserDirectS3Uploader {

  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': BrowserDirectS3Uploader.name });

  public async fromFileSystem(s3: aws.S3, fileName: string, bucketName: string): Promise<void> {

    const fileContent: Buffer = fs.readFileSync(fileName);
    const params: aws.S3.PutObjectRequest = {
      'Bucket': this.eProps.getS3BucketName(bucketName),
      'Key': FileOptions.generateUUID() + '.' + FileOptions.getFileExtension(fileName),
      'Body': fileContent
    };

    try {
      let uploadedObject: aws.S3.ManagedUpload.SendData = await s3.upload(params).promise();
      this.logger.info('File successfully uploaded');
    }
    catch (err: any) { this.logger.error((<Error>err)); }
  }

  public fromRequest(s3: aws.S3, bucketName: string, fileExtension: string): RequestHandler {
    let context: BrowserDirectS3Uploader = this;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      const params: aws.S3.PutObjectRequest = {
        'Bucket': context.eProps.getS3BucketName(bucketName),
        'Key': FileOptions.generateUUID(),
        'Body': req
      };
      try {
        let uploadedObject: aws.S3.ManagedUpload.SendData = await s3.upload(params).promise();
        context.logger.error('File successfully uploaded');
      }
      catch (err: any) { context.logger.error((<Error>err)); }
    }
  }

  public fromJsonRequest(s3: aws.S3, bucketName: string, fileExtension: string, contentType: string): RequestHandler {
    let context: BrowserDirectS3Uploader = this;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let s3: aws.S3 = new aws.S3({});
      const { id, fileName } = JSON.parse((req.get('body') as string));
      const Key = id + '/' + fileName; //upload to s3 folder "id" with filename === fn
      const params: aws.S3.PutObjectRequest = {
        'Key': Key,
        'Bucket': bucketName,
        'Body': req,
        'ContentType': contentType
      };

      try {
        let uploadedObject: aws.S3.ManagedUpload.SendData = await s3.upload(params).promise();
        context.logger.info('File successfully uploaded');
        res.json({ 'key': Key });
      }
      catch (err: any) {
        context.logger.error(err);
        res.json({ 'message': 'Error during upload' });
      }
    }
  }

  public async createBucket(bucketName: string): Promise<void> {
    let s3: aws.S3 = new aws.S3({});
    const params: aws.S3.CreateBucketRequest = {
      'Bucket': bucketName,
      'CreateBucketConfiguration': {
        'LocationConstraint': 'eu-west-1'
      }
    };

    try { let createdBucket: aws.S3.CreateBucketOutput = await s3.createBucket(params).promise(); }
    catch (err: any) { this.logger.error((<aws.AWSError>err)); }
  }

}