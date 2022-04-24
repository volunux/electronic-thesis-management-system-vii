import { Request, RequestHandler, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import ConfigurationProperties from '../../config/ConfigurationProperties';
import S3ObjectChange from './S3ObjectChange';
import FileOptions from './others/FileOptions';
import SimpleLogger from '../../util/other/Logger';
import aws from 'aws-sdk';

const { v4: uuidv4 } = require('uuid');

export default class S3SignedUrlGenerator {

  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': S3SignedUrlGenerator.name });
  private static instance: S3SignedUrlGenerator;
  private s3: aws.S3;
  private s3Config: aws.S3;

  private constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) {
    this.s3Config = s3Instance;
    this.s3 = new aws.S3();
    aws.config.update(s3Configuration);
  }

  public static getInstance(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions): S3SignedUrlGenerator {
    if (!S3SignedUrlGenerator.instance) { S3SignedUrlGenerator.instance = new S3SignedUrlGenerator(s3Instance, s3Configuration); }
    return S3SignedUrlGenerator.instance;
  }

  public createSignedUrlPost(bucketName: string, acl?: string): RequestHandler {
    let s3: aws.S3 = this.s3;
    let context: S3SignedUrlGenerator = this;
    return function(req: Request, res: Response, next: NextFunction): void {
      let params: aws.S3.PresignedPost.Params = {

        'Bucket': context.eProps.getS3BucketName(bucketName),
        'Fields': {
          'key': Date.now().toString() + FileOptions.getFileExtension(req.body.fileName),
          'acl': acl ? acl : 'public-read',
          'Content-Type': req.body.contentType,
          'success_action_status': '201',
          'Expires': '300000'
        },
        'Conditions': [
          { 'bucket': context.eProps.getS3BucketName(bucketName) },
          { 'acl': acl ? acl : 'public-read' },
          { 'success_action_status': '201' },
          ['starts-with', '$Content-Type', req.body.contentType.split('/')[0]],
          ["content-length-range", '0', '1048576']],
        'Expires': 300000
      };

      s3.createPresignedPost(params, (err: Error, data: aws.S3.PresignedPost) => {

        if (err) { context.logger.error(err); }

        else { res.status(200).json(data); }
      });
    }
  }

  public createSignedUrlPut(bucketName: string, acl?: string): RequestHandler {

    let s3: aws.S3 = this.s3;
    let context: S3SignedUrlGenerator = this;

    return function(req: Request, res: Response, next: NextFunction): void {

      let params: any = {

        'Bucket': context.eProps.getS3BucketName(bucketName),
        'Key': uuidv4() + FileOptions.getFileExtension(req.body.filename),
        'ACL': acl ? acl : 'public-read',
        'Content-Type': req.body.contentType,
        'Expires': 86400000
      };

      s3.getSignedUrl('putObject', params, (err: Error, data: string) => {

        if (err) { context.logger.error(err); }

        else { res.status(200).json(data); }
      });
    }
  }

  public createSignedUrlGet(key: string, bucketName: string): string | null {

    let params: any = {

      'Bucket': bucketName,
      'Key': key,
      'Expires': 25200
    };

    let objectUrl: string | null = null;

    try { objectUrl = this.s3.getSignedUrl('getObject', params); }

    catch (err: any) { this.logger.error(err); }

    return objectUrl;
  }

  public objectDeleteByKeyInternal(bucketName: string): RequestHandler {
    let s3: aws.S3 = this.s3;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {

      let objectkey: string = req.params.objectkey;
      var i: number = 0;

      for (; i < 3; i++) {

        try {
          await S3ObjectChange.objectDeleteByKey(objectkey, bucketName);

          i = 4;

          res.status(200).json({ 'message': 'Successfully delete object.' });
        }

        catch (err: any) { res.status(400).json({ 'message': 'Failed to remove object.' }); }
      }
    }
  }

}