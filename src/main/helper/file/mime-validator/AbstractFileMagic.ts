export default interface AbstractFileMagic {
  getSignature(key: string): void;
  verifySignature(magic: string): boolean;
  getMimetypeList(): string[];

}