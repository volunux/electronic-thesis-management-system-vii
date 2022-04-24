export default interface FileUploadErrorMessage {
  getRequired(): string;
  getAtLeast(quantity: number): string;
  getSize(fileSize: number): string;
  getValidObject(): string;
  getMimeType(): string;
}