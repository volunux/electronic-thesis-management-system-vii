import FileUploadErrorMessage from './FileUploadErrorMessage';
import DocumentFileUploadErrorMessage from './impl/DocumentFileUploadErrorMessage';
import ImageFileUploadErrorMessage from './impl/ImageFileUploadErrorMessage';

export default class FileTypeErrorList {

  private static errorList: Map<string, FileUploadErrorMessage> = new Map<string, FileUploadErrorMessage>();

  private static addErrorsToList(): void {
    FileTypeErrorList.errorList.set('image', new ImageFileUploadErrorMessage('Image'));
    FileTypeErrorList.errorList.set('document', new DocumentFileUploadErrorMessage('Document'));
  }

  public static getErrorType(key: string): FileUploadErrorMessage | null {
    if (FileTypeErrorList.errorList.size < 1) FileTypeErrorList.addErrorsToList();
    let fileTypeError: FileUploadErrorMessage | undefined = FileTypeErrorList.errorList.get(key);

    if (fileTypeError === undefined || fileTypeError === null) { return null; }
    else { return fileTypeError }
  }

  public static add(name: string, errorType: FileUploadErrorMessage): void {
    FileTypeErrorList.errorList.set(name, errorType);
  }

}