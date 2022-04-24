import { Request, RequestHandler, Response, NextFunction } from 'express';
import FileTypeErrorList from '../errors/FileTypeErrorList';
import FileUploadTypeError from '../errors/FileUploadTypeError';
import FileUploadErrorMessage from '../errors/FileUploadErrorMessage';
import FileTypeMagic from '../mime-validator/FileTypeMagic';
import AbstractFileMagic from '../mime-validator/AbstractFileMagic';
import fs from 'fs';

export class LocalFileValidator {

  private static instance: LocalFileValidator;

  public static getInstance(): LocalFileValidator {
    if (!LocalFileValidator.instance) { LocalFileValidator.instance = new LocalFileValidator(); }
    return LocalFileValidator.instance;
  }

  public mimetype(fileType: string, filePath: string): RequestHandler {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    return function(req: Request, res: Response, next: NextFunction): void {
      if (req.file !== null && req.file !== undefined) {
        let file: Express.Multer.File = req.file;
        let fileMimetype = file.mimetype;
        if ((<AbstractFileMagic>FileTypeMagic.getFileMagic(fileType)).getMimetypeList().indexOf(fileMimetype) == -1) {
          let file: Express.Multer.File = req.file;
          let fileName: string = process.cwd() + '/src/resource/' + filePath + '/' + req.body.display_type + '.' + (<Express.Multer.File>req.file).filename.split('.')[1];

          if (fs.existsSync(fileName) == true) fs.unlinkSync(fileName);
          req.validationErrorTypeList.add(FileUploadTypeError.MIMETYPE);

          if (errorType !== null) { req.validationErrors.addError(errorType.getMimeType()); }
          return next();
        }
        else { return next(); }
      }
      else { return next(); }
    }
  }

}