import PhotoConfigurer from './PhotoConfigurer';
import DocumentConfigurer from './DocumentConfigurer';
import FileConfigurer from './FileConfigurer';

export class FileConfigurerList {

  private static fileList : Map<string , FileConfigurer> = new Map<string , FileConfigurer>(); 

  private static addFileMagicToList() : void {
    FileConfigurerList.fileList.set('image' , PhotoConfigurer.getInstance());
    FileConfigurerList.fileList.set('document' , DocumentConfigurer.getInstance());
  }

  public static getFileConfigurer(key : string) : FileConfigurer | null {
    if (FileConfigurerList.fileList.size < 1) FileConfigurerList.addFileMagicToList();
    let fileConfigurer : FileConfigurer | undefined = FileConfigurerList.fileList.get(key);
    if (fileConfigurer === undefined || fileConfigurer === null) { return null; }
    else { return fileConfigurer; }
  }

  public static add(name : string , fileConfigurer : FileConfigurer) : void { FileConfigurerList.fileList.set(name , fileConfigurer); }

}