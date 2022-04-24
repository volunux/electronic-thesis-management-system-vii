import FileUploadErrorMessage from './FileUploadErrorMessage';
import FileSizeCalculator from '../../../util/other/FileSizeCalculator';
import CalculatedFileSize from '../../../util/other/CalculatedFileSize';

export default abstract class FileUploadErrorMessageImpl implements FileUploadErrorMessage {

  constructor(objectType: string) {
    this.objectType = objectType;
  }

  private objectType: string | null = 'valid';

  public getSize(fileSize: number): string {
    let calculatedFileSize: CalculatedFileSize = FileSizeCalculator.calculateSizeActual(fileSize);
    return "File or files cannot be greater than " + calculatedFileSize.getFileSizeUnit() + " or " + " in size."
  }

  public getRequired(): string { return this.objectType + ' file or files should be provided and cannot be empty.'; }

  public getAtLeast(quantity: number): string { return 'At least ' + quantity + ' ' + this.objectType + ' file or files should be provided.'; }

  public getValidObject(): string { return this.objectType + ' file or files have to be re-uploaded due to invalid form data.'; }

  public getMimeType(): string { return 'Only ' + this.objectType + ' file or files is allowed to be uploaded.'; }

}