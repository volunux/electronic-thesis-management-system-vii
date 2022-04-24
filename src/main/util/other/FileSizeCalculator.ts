import CalculatedFileSize from './CalculatedFileSize';

export default class FileSizeCalculator {

  public static calculateSizeActual(fileSize : number | string) : CalculatedFileSize {
    let finalSize : number = +fileSize;
    let calculatedSize : string = finalSize.toString();
    let kilobyte : number = 1024 , megabyte : number = 1048576 , gigabyte : number = 1073741824;

    if (finalSize < kilobyte) { calculatedSize = finalSize.toFixed(2) + " byte"; }
    else if (finalSize >= kilobyte && finalSize <= megabyte) { finalSize /= 1024;
      calculatedSize = finalSize.toFixed(2) + " kb"; }
    else if (finalSize >= megabyte && finalSize <= gigabyte) { finalSize /= 1024; finalSize /= 1024;
      calculatedSize = finalSize.toFixed(2) + " mb"; }
    else if (finalSize >= gigabyte) { finalSize /= 1024; finalSize /= 1024; finalSize /= 1024;
      calculatedSize = finalSize.toFixed(2) + " gb"; }
      
    return new CalculatedFileSize({'finalSize' : finalSize , 'calculatedSize' : calculatedSize , 'fileSizeUnit' : []});
  }

}