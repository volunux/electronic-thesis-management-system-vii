import { Request, RequestHandler, Response, NextFunction } from 'express';
import FileTypeErrorList from '../errors/FileTypeErrorList';
import FileUploadErrorMessage from '../errors/FileUploadErrorMessage';
import FileUploadTypeError from '../errors/FileUploadTypeError';

export default abstract class GeneralUploader {

  public checkFileUpload(fileType: string): RequestHandler {
    let errorType: FileUploadErrorMessage | null = FileTypeErrorList.getErrorType(fileType);
    return function(req: Request, res: Response, next: NextFunction): void {
      if (req.file === null && req.file === undefined) {
        req.validationErrorTypeList.add(FileUploadTypeError.REQUIRED);
        if (errorType !== null) { req.validationErrors.addError(errorType.getRequired()); }
      }
      return next();
    }
  }

  public addFileUpload(req: Request, res: Response, next: NextFunction): void {
    if (req.file !== undefined && req.file !== null) { req.body.file_detail = req.file; }
    return next();
  }

}