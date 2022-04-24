function validateObjectFileSize(choosenFile , fileUploadButton , fileTextElement , fileSize , customButtonElement , validationStatus) {

  if (choosenFile != null) {
    if (choosenFile.size > fileSize) {
        /** Validation 3 : The .disabled class is never added or the disabled property is never set true to the fileUploadButton in this block,
        because the element is always disabled and the .disabled class is added to the fileUploadButton in Validation 2: **/
        fileTextElement.textContent = statusText.isFileSizeInvalid;
        customButtonElement.textContent = statusText.fileChoosenText(choosenFile.name);
        validationStatus.failed = true;
        return; }

    else {
        /** Validation 4 : Before the .disabled class is removed and the disabled property is set to false for the fileUploadButton,
        the class is added and property is set to true in Validation 2 **/
        addAndRemoveClassToElement(fileUploadButton , '' , 'disabled' , false);
        customButtonElement.textContent = statusText.fileChoosenText(choosenFile.name);
        fileTextElement.textContent = statusText.isFileSizeValid; }
     }
   }



function validateObjectType(choosenFile , fileUploadButton , fileTextElement , customButtonElement , validationStatus) {
  if (choosenFile != null) {
    if (choosenFile.type.indexOf(statusText.fileTypeAllowedToUpload) == -1) {
      
      /** Validation 5 : The .disabled class and disabled property is added and set to true for the fileUploadButton
      if the type of the user chooses does not meet the criteria of the file allowed to be uploaded.
      This is also important because the Validation 2 adds the .disabled class and disable the button before performing any subsequent validation 
      like validateFileSize() that could remove the class .disable and set the disabled property to false if the file size is valid **/
      setClassAndDisableElement(fileUploadButton , 'disabled' , '' , true);
      fileTextElement.textContent = statusText.isFileTypeInvalid;
      validationStatus.failed = true;
      return; }

    /** Validation 6 : Before the .disabled class is removed and the disabled property is set to false for the fileUploadButton,
    the class is added and property is set to true in Validation 2 **/
    setClassAndDisableElement(fileUploadButton , '' , 'disabled' , false);
    customButtonElement.textContent = statusText.fileChoosenText(choosenFile.name);
    fileTextElement.textContent = statusText.isFileTypeValid }
}


function getObjectTypeFromMagicNumber(signature) {
  switch (signature) {
      case "89504E47" :
    return "image/png"

      case "47494638" :
    return "image/gif"

      case "25504446" :
    return "application/pdf"

      case "FFD8FFDB" :
      case "FFD8FFE0" :
      case "FFD8FFE1" :
      case "FFD8FFE2" :
      case "FFD8FFE3" :
      case "FFD8FFE8" :
    return 'image/jpeg'

      case "504B0304" :
    return "application/zip"

      default :
    return "Unknown filetype"
  }
}


function validateObjectSignature(choosenFile , fileUploadButton , fileTextElement , customButtonElement , validationStatus) {
    const filereader = new FileReader();

    filereader.onloadend = function(evt) {

      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result);
        let bytes = [];
        uint.forEach((byte) => { bytes.push(byte.toString(16)); });

        const hex = bytes.join('').toUpperCase();
        let signatureType = getObjectTypeFromMagicNumber(hex);

        if (signatureType.indexOf(statusText.fileTypeAllowedToUpload) == -1) {
          setClassAndDisableElement(fileUploadButton , 'disabled' , '' , true);
          fileTextElement.textContent = statusText.isFileTypeInvalid;
          validationStatus.failed = true;

          return; } } }

      if (choosenFile != null) {
        const blob = choosenFile.slice(0, 4);
        filereader.readAsArrayBuffer(blob); }
}


function deleteObject(choosenFile , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , key , uploadUrlElement) {
  return function(event) {

    stopDefault(event);
    setClassAndDisableElement(fileUploadButtonDelete , 'disabled' , '' , true);
    fileTextElement.textContent = statusText.fileDeleteInProgress;
    let objectRemover = new XMLHttpRequest();

  objectRemover.onload = function(res) {
    if (res.target.status == 200) {
      setClassAndDisableElement(customButtonElement , '' , 'disabled' , false);
      setClassAndDisableElement(fileUploadButton , '' , 'disabled' , false);
      setElementDisplay(fileUploadButton , 'inline-block');
      setClassAndDisableElement(fileUploadButtonDelete , 'disabled' , '' , true);
      setElementDisplay(fileUploadButtonDelete , 'none');
      fileTextElement.textContent = statusText.fileDeleteSuccess; }
    else {
      setClassAndDisableElement(fileUploadButtonDelete , '' , 'disabled' , false);
      fileTextElement.textContent = statusText.fileUploadError;
      return; }
  };

  objectRemover.onerror = function(event) {
    setClassAndDisableElement(fileUploadButtonDelete , '' , 'disabled' , false);
    fileTextElement.textContent = statusText.fileDeleteError; }

  objectRemover.ontimeout = function(event) {
    setClassAndDisableElement(fileUploadButtonDelete , '' , 'disabled' , false);    
    fileTextElement.textContent = statusText.fileDeleteError; };

    objectRemover.open('DELETE' , uploadUrlElement.value + key);
    objectRemover.setRequestHeader('X-Requested-With' , 'XMLHttpRequest');
    objectRemover.setRequestHeader('Content-Type' , 'application/json');
    objectRemover.timeout = 30000;
    let objectRemoverBody = JSON.stringify({'_csrf' : csrfToken});
    objectRemover.send(objectRemoverBody);
  }

}