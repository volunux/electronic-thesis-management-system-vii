import PhotoMagic from './PhotoMagic';
import DocumentMagic from './DocumentMagic';
import AbstractFileMagic from './AbstractFileMagic';

export default class FileTypeMagic {

  private static fileList: Map<string, AbstractFileMagic> = new Map<string, AbstractFileMagic>();

  private static addFileMagicToList(): void {
    FileTypeMagic.fileList.set('image', PhotoMagic.getInstance());
    FileTypeMagic.fileList.set('document', DocumentMagic.getInstance());
  }

  public static getFileMagic(key: string): AbstractFileMagic | undefined {
    if (FileTypeMagic.fileList.size < 1) FileTypeMagic.addFileMagicToList();
    return FileTypeMagic.fileList.get(key);
  }

  public static add(name: string, fileTypeMagic: AbstractFileMagic): void { FileTypeMagic.fileList.set(name, fileTypeMagic); }
}