import AbstractFileMagic from './AbstractFileMagic';

export default class DocumentMagic implements AbstractFileMagic {

  private static instance: DocumentMagic;
  private static signatureList: Map<string, string> = new Map<string, string>();
  private mimeTypeList: string[] = ['application/pdf', 'application/docx', 'application/doc', 'application/octet-stream'];

  public static getInstance(): DocumentMagic {
    if (!DocumentMagic.instance) { DocumentMagic.instance = new DocumentMagic(); }
    return DocumentMagic.instance
  }

  static {
    this.signatureList.set('pdf', '25504446');
    this.signatureList.set('docx', '504B0304');
    this.signatureList.set('doc', '0D444F43');
    this.signatureList.set('docx2', 'DBA52D00');
    this.signatureList.set('docx3', 'D0CF11E0');
    this.signatureList.set('docx4', '504b0304');
  }

  public getSignature(key: string): string | undefined { return DocumentMagic.signatureList.get(key); }

  public verifySignature(magic: string): boolean {
    if (magic == this.getSignature('pdf') || magic == this.getSignature('docx') || magic == this.getSignature('doc')
      || magic == this.getSignature('docx2') || magic == this.getSignature('docx3') || magic == this.getSignature('docx4')) { return true; }
    else { return false; }
  }

  public getMimetypeList(): string[] { return this.mimeTypeList; }
}