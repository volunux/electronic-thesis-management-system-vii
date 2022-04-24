import { Request, RequestHandler, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import SimpleLogger from '../../../util/other/Logger';
import ConfigurationProperties from '../../../config/ConfigurationProperties';
import GeneralUploader from './GeneralUploader';
import FileTypeErrorList from '../errors/FileTypeErrorList';
import FileUploadTypeError from '../errors/FileUploadTypeError';
import FileTypeMagic from '../mime-validator/FileTypeMagic';
import AbstractFileMagic from '../mime-validator/AbstractFileMagic';
import FileOptions from '../others/FileOptions';
import FileUploadErrorMessage from '../errors/FileUploadErrorMessage';
import multer, { StorageEngine, Multer } from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

export default abstract class AbstractFileUploader extends GeneralUploader {

  private readonly eProps: ConfigurationProperties = ConfigurationProperties.getInstance();
  private readonly logger: Logger = SimpleLogger.getLogger().child({ 'component': AbstractFileUploader.name });
  private s3: aws.S3;
  private s3Config: aws.S3;

  constructor(s3Instance: aws.S3, s3Configuration: aws.ConfigurationOptions) {

    super();
    this.s3Config = s3Instance;
    this.s3 = new aws.S3();
    aws.config.update(s3Configuration);
  }


  public getUploader(bucketName: string, fileSize: number, filesCount: number, fieldName: string, fileType: string, acl?: string): RequestHandler {

    let upload: Multer = multer({
      'storage': this.getS3Configuration(bucketName, acl),
      'limits': { 'files': filesCount }
    });

    return async function uploadHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
      let handleUpload: RequestHandler = upload.single(fieldName);

      handleUpload(req, res, function(err): void {
        let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);

        if (err instanceof multer.MulterError) {
          if (errorType !== null) {
            if ((<multer.MulterError>err).code === 'LIMIT_UNEXPECTED_FILE') req.validationErrors.addError(errorType.getValidObject());
            if ((<multer.MulterError>err).code === 'LIMIT_FIELD_VALUE') req.validationErrors.addError(errorType.getValidObject());
            if ((<multer.MulterError>err).code === 'LIMIT_FILE_COUNT') req.validationErrors.addError(errorType.getValidObject());
            if ((<multer.MulterError>err).code === 'LIMIT_FIELD_KEY') req.validationErrors.addError(errorType.getValidObject());
            if ((<multer.MulterError>err).code === 'LIMIT_FIELD_COUNT') req.validationErrors.addError(errorType.getValidObject());
          }
        }

        else if (err !== null && err !== undefined) { req.validationErrors.addError('There is an error in the file you are trying to upload, please try again.'); }

        return next();
      });
    }
  }

  public validate(bucketName: string, fileType: string): RequestHandler {
    let s3: aws.S3 = this.s3Config;
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    let context: AbstractFileUploader = this;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      if (req.file !== null && req.file !== undefined && req.validationErrorTypeList.has(FileUploadTypeError.MIMETYPE) === false) {
        if (!(req.body)) req.body = { 'objectType': true };
        let key: string = (<Express.MulterS3.File>req.file).key;

        try {
          if (key !== undefined && key !== null) {
            let params: aws.S3.DeleteObjectRequest = { 'Bucket': context.eProps.getS3BucketName(bucketName), 'Key': key };
            let objectData: aws.S3.GetObjectOutput | null = null;

            try { objectData = await s3.getObject(params).promise(); }
            catch (err: any) { context.logger.error((<aws.AWSError>err)); }

            if (objectData !== null && objectData !== undefined && objectData.Body !== null && objectData.Body !== undefined) {
              let bitmap: string = (<aws.S3.Body>objectData.Body).toString('hex', 0, 4);
              if (!(<AbstractFileMagic>FileTypeMagic.getFileMagic(fileType)).verifySignature(bitmap)) {
                try { let deletedObject: aws.S3.DeleteObjectOutput = await s3.deleteObject(params).promise(); }
                catch (err: any) { context.logger.error((<aws.AWSError>err)); }

                if (!(req.body)) req.body = {};
                req.body.objectType = false;
                req.validationErrorTypeList.add(FileUploadTypeError.MIMETYPE);
                if (errorType !== null) { req.validationErrors.addError(errorType.getMimeType()); }
                return next();
              }
              else { return next(); }
            }
          }
        }
        catch (err: any) { context.logger.error((<aws.AWSError>err)); }
      }
      else { return next(); }
    }
  }

  public checkFileSize(bucketName: string, fileType: string, fileSize: number): RequestHandler {
    let s3: aws.S3 = this.s3Config;
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    let context: AbstractFileUploader = this;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      let calculatedFileSize: number = 1024 * fileSize;
      if (<Express.Multer.File>req.file !== null && req.file !== undefined) {
        if (req.file.size > calculatedFileSize && req.body.objectType) {
          let key: string = (<Express.MulterS3.File>req.file).key;

          if (key !== undefined && key !== null) {
            let params: aws.S3.DeleteObjectRequest = { 'Bucket': context.eProps.getS3BucketName(bucketName), 'Key': key };
            try { let deletedObject: aws.S3.DeleteObjectOutput = await s3.deleteObject(params).promise(); }
            catch (err: any) { context.logger.error((<aws.AWSError>err)); }

            if (errorType !== null) req.validationErrors.addError(errorType.getSize(fileSize));
            req.validationErrorTypeList.add(FileUploadTypeError.SIZE);
            return next();
          }
        }

        else if ((<Express.MulterS3.File>req.file).size > calculatedFileSize) {
          req.validationErrorTypeList.add(FileUploadTypeError.SIZE);
          if (errorType !== null) { req.validationErrors.addError(errorType.getSize(fileSize)); }
          return next();
        }
        else { return next(); }
      }
      else { return next(); }
    }
  }

  public getS3Configuration(bucketName: string, acl?: string): StorageEngine {
    let context: AbstractFileUploader = this;
    return multerS3({
      's3': this.s3Config,
      'bucket': context.eProps.getS3BucketName(bucketName),
      'acl': acl ? acl : 'public-read',
      'key': (req: Request, file: Express.Multer.File, cb: Function): void => {
        let fileName: string = Date.now().toString() + FileOptions.getFileExtension(file.originalname);
        cb(null, fileName);
      },
      'metadata': (req: Request, file: Express.Multer.File, cb: Function): void => {
        cb(null, { 'fieldName': file.fieldname, 'Content-Type': file.mimetype });
      }
    })
  }

  public deleteFile(bucketName: string, fileType: string): RequestHandler {
    let s3: aws.S3 = this.s3Config;
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    let context: AbstractFileUploader = this;

    return async function(req: Request, res: Response, next: NextFunction): Promise<void> {
      if (req.validationErrors.isEmpty() === false) {
        if (errorType !== null) { req.validationErrors.addError(errorType.getValidObject()); }
        let key: string = (<Express.MulterS3.File>req.file).key;
        if (key !== undefined && key !== null) {
          let params: aws.S3.DeleteObjectRequest = { 'Bucket': context.eProps.getS3BucketName(bucketName), 'Key': key };
          try { let deletedObject: aws.S3.DeleteObjectOutput = await s3.deleteObject(params).promise(); }
          catch (err: any) { context.logger.error((<aws.AWSError>err)); }
        }
        return next();
      }
      else { return next(); }
    }
  }

  public async deleteFileII(req: Request, errArr: any, fileType: string, bucketName: string): Promise<void> {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    if (!(req.validationErrorTypeList.has(FileUploadTypeError.MIMETYPE) || req.validationErrorTypeList.has(FileUploadTypeError.SIZE))) {
      if (errorType !== null) { req.validationErrors.addError(errorType.getValidObject()); }
      let key: string = (<Express.MulterS3.File>req.file).key;

      if (key !== undefined && key !== null) {
        let params: aws.S3.DeleteObjectRequest = { 'Bucket': this.eProps.getS3BucketName(bucketName), 'Key': key };

        try { let deletedObject: aws.S3.DeleteObjectOutput = await this.s3.deleteObject(params).promise(); }
        catch (err: any) { this.logger.error((<aws.AWSError>err)); }
      }
    }
  }

}