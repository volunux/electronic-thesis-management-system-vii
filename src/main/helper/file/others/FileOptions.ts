import path from 'path';
let { v4: uuidv4 } = require('uuid');

export default class FileOptions {

  public static getFileExtension(fileName: string): string {
    let ext: string = path.extname(fileName);
    return ext;
  }

  public static generateUUIDFileName(fileName: string): string {
    let ext: string = path.extname(fileName);
    fileName = uuidv4() + ext;
    return fileName;
  }

  public static generateUUID(): string { return uuidv4(); }

  public static generateUniqueFileName(fileName: string): string {
    let ext: string = path.extname(fileName)
    let date: number = Date.now();
    let randomHash: string = '';
    let characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    new Array(20).fill(null).map(() => { randomHash += characters.charAt(Math.floor(Math.random() * characters.length)); });
    return randomHash + '-' + date + ext;
  }

}