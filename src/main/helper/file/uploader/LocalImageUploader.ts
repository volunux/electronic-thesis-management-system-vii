import { Request, Response, NextFunction, RequestHandler } from 'express';
import GeneralUploader from './GeneralUploader';
import FileTypeMagic from '../mime-validator/FileTypeMagic';
import FileTypeErrorList from '../errors/FileTypeErrorList';
import AbstractFileMagic from '../mime-validator/AbstractFileMagic';
import FileUploadTypeError from '../errors/FileUploadTypeError';
import FileUploadErrorMessage from '../errors/FileUploadErrorMessage';
import multer, { Multer } from 'multer';
import path from 'path';
import fs from 'fs';

export class LocalImageUploader extends GeneralUploader {

  private constructor() { super(); }
  private static instance: LocalImageUploader;
  private static objectValidationOptions: any = { 'objectType': true, 'objectSize': true, 'objectValid': true };

  public getUploader(fileSize: number, filesCount: number): Multer {
    let upload: Multer = multer({
      'storage': this.getLocalConfiguration(),
      'limits': {
        'files': filesCount
      }
    });
    return upload;
  }

  public static getInstance(): LocalImageUploader {
    if (!LocalImageUploader.instance) { LocalImageUploader.instance = new LocalImageUploader(); }
    return LocalImageUploader.instance;
  }

  public validate(fileType: string, filePath: string): RequestHandler {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    return function(req: Request, res: Response, next: NextFunction): void {
      if (req.file !== null && req.file !== undefined && req.validationErrorTypeList.has(FileUploadTypeError.MIMETYPE) === false) {
        let bitmap: string = fs.readFileSync(process.cwd() + '/src/resource/' + filePath + '/' + (<Express.Multer.File>req.file).filename).toString('hex', 0, 4);
        if (!(<AbstractFileMagic>FileTypeMagic.getFileMagic(fileType)).verifySignature(bitmap)) {
          let fileName: string = process.cwd() + '/src/resource/' + filePath + '/' + req.body.display_type + req.file.filename.split('.')[1];
          if (fs.existsSync(fileName) === true) { fs.unlinkSync(fileName); }
          LocalImageUploader.objectValidationOptions.objectType = false;
          req.validationErrorTypeList.add(FileUploadTypeError.MIMETYPE);
          if (errorType !== null) { req.validationErrors.addError(errorType.getMimeType()); }
          return next();
        }
        else { return next(); }
      }
      else { return next(); }
    }
  }

  public checkFileSize(fileType: string, fileSize: number, filePath: string): RequestHandler {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    return function(req: Request, res: Response, next: NextFunction): void {
      let computedSize: number = 1024 * fileSize;
      if (req.file !== null && req.file !== undefined) {
        if ((<Express.Multer.File>req.file).size > computedSize && LocalImageUploader.objectValidationOptions.objectType) {
          let fileName: string = process.cwd() + '/src/resource/' + filePath + '/' + req.body.display_type + '.' + (<Express.Multer.File>req.file).filename.split('.')[1];

          if (fs.existsSync(fileName)) { fs.unlinkSync(fileName); }
          req.validationErrorTypeList.add(FileUploadTypeError.SIZE);

          if (errorType !== null) { req.validationErrors.addError(errorType.getSize(computedSize)); }
          return next();
        }

        else if ((<Express.Multer.File>req.file).size > computedSize) {
          req.validationErrorTypeList.add(FileUploadTypeError.SIZE);
          if (errorType !== null) { req.validationErrors.addError(errorType.getSize(computedSize)); }
          return next();
        }
        else { return next(); }
      }
      else { return next(); }
    }
  }

  public getLocalConfiguration(): multer.StorageEngine {
    return multer.diskStorage({
      'destination': function(req: Request, file: Express.Multer.File, cb: Function): void {
        let titlePath: string = process.cwd() + '/src/resource/images/';

        if (fs.existsSync(titlePath)) { cb(null, titlePath); }
        else {
          fs.mkdir(titlePath, function(err: NodeJS.ErrnoException | null): void {
            cb(null, titlePath);
          });
        }
      },

      'filename': function(req: Request, file: Express.Multer.File, cb: Function): void {
        let ext: string = path.extname(file.originalname);
        let fileName: string = req.body.display_type + ext;
        cb(null, fileName);
      }
    });
  }

  public getLocalConfiguration2(): any {
    return multer.diskStorage({
      'destination': function(req: Request, file: Express.Multer.File, cb: Function): void {

        let titlePath: string = process.cwd() + '/src/resource/titles/';
        if (fs.existsSync(titlePath)) { cb(null, titlePath); }
        else {
          fs.mkdir(titlePath, function(err: NodeJS.ErrnoException | null) {
            cb(null, titlePath);
          });
        }
      },

      'filename': function(req: Request, file: Express.Multer.File, cb: Function): void {
        let ext: string = path.extname(file.originalname), possible: string = 'abcdefghijklmnopqrstuvwxyz0123456789', imgUrl: string = '';
        for (var i = 0; i < 6; i += 1) {
          imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        let fileName: string = imgUrl + ext;
        cb(null, fileName);
      }
    });
  }

  public deletePhoto(fileType: string): RequestHandler {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    return function(req: Request, res: Response, next: NextFunction): void {
      if (!req.validationErrors.isEmpty()) {
        if (errorType !== null) { req.validationErrors.addError(errorType.getValidObject()); }
        fs.unlinkSync(process.cwd() + '/src/resource/images/' + req.body.display_type);
        return next();
      }
      else { return next(); }
    }
  }

  public deleteFile(req: Request, fileType: string, errArr: any): void {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    if (!(req.validationErrorTypeList.has(FileUploadTypeError.MIMETYPE) || req.validationErrorTypeList.has(FileUploadTypeError.SIZE))) {
      if (errorType !== null) { req.validationErrors.addError(errorType.getValidObject()); }
      fs.unlinkSync(process.cwd() + '/src/resource/images/' + req.body.display_type);
    }
  }

}