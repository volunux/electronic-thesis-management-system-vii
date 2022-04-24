let uploadInput = document.querySelectorAll('input[type=file]');

let statusText = {
  'isFileSizeInvalid' : 'File size is too large. Please choose file that is minimum or equal to required file size.' ,
  'isFileSizeValid' : 'File size is valid and file can be uploaded.' ,
  'isFileTypeInvalid' : 'File type is invalid and file cannot be uploaded.' ,
  'isFileTypeValid' : 'File type is valid and file can be uploaded.' ,
  'isFileUploadRequired' : 'File upload is required, please choose a file.' ,
  'isFileUploadOptional' : 'File upload is optional.',
  'fileTypeAllowedToUploadText' : 'Only Image Files or Documents with file extensions like docx or pdf is allowed in this field.' ,
  'fileTypeAllowedToUpload' : 'image',
  'chooseAFile' : 'Choose a File',
  'fileUploadInProgress' : 'File is currently uploading. Please be patient and wait. % uploaded : ' ,
  'fileUploadError' : 'An Error may have occured. Please try again.' ,
  'fileUploadAbort' : 'File upload cancelled. You can now upload another file.' ,
  'fileUploadTimeout' : 'File upload has has timed out. Please try again.' ,
  'fileUploadSuccess' : 'File has successfully uploaded.' ,
  'fileDeleteInProgress' : 'File is getting deleted. Please be patient and wait.' ,
  'fileDeleteSuccess' : 'File successfully deleted. You can now upload another file.' ,
  'fileDeleteError' : 'An error may have occured while removing file. Please try again.',
  'fileChoosenText' : function (fileName) {

    fileName = fileName && fileName !== '' ? fileName : 'Unknown';

    if (fileName.length > 15) fileName = fileName.slice(0, 8) + '.....'; 

    return 'A file named ' + fileName + ' has been selected';
  }
};

var _csrf = document.querySelector("input[name=_csrf]");
var csrfToken = null;
if (_csrf !== null) csrfToken = _csrf.value;

window.addEventListener('load' , function(event) {

let defaultSubmitButton = document.querySelector('.btn-submit');
if (defaultSubmitButton !== null) setElementDisplay(defaultSubmitButton , 'none');

uploadInput.forEach((element) => {

let fileElementParent = element.closest('fieldset.form-group');
let customButtonElement = document.createElement('button');
customButtonElement.className = 'btn-choose-file form-btn-upload btn-blue wide';
customButtonElement.textContent = statusText.chooseAFile;
fileElementParent.insertBefore(customButtonElement , element.nextSibling);
let uploadFileType = fileElementParent.querySelector('input[name=file_type]');
let statusTextLocal = Object.assign(statusText);
setElementDisplay(element , 'none');

customButtonElement.addEventListener('click' , function(event) {
  stopDefault(event);
  element.click();
});

element.addEventListener('change' , (event) => {
stopDefault(event);

let validationStatus = {'failed' : false};
let fileElement = event.target;
let fileTextElement = fileElementParent.querySelector('p.file-text');
let fileUploadButton = fileElementParent.querySelector('button.btn-upload');
let fileUploadButtonDelete = fileElementParent.querySelector('button.btn-file-upload-delete');
let fileUploadButtonCancel = fileElementParent.querySelector('button.btn-file-upload-cancel');
let requiredUploadFileSize = fileElementParent.querySelector('input[name=file_size]').value;
let uploadUrlElement = fileElementParent.querySelector('input[name=uploadUrl]');
if (uploadFileType !== null && uploadFileType.value !== '') statusTextLocal.fileTypeAllowedToUpload = uploadFileType.value;

let files = fileElement.files;

if (files.length < 1 && fileElement.required === true) { 

  /** Validation 1: The .disabled class is added to the fileUploadButton and the disabled property is set to true. When after a file is choosen, valid
  and pass this test condition in the first time, this code is never executed; but after user decide to change the input file and 
  select no file; if the file is required to be uploaded, this settings is applied **/
  setClassAndDisableElement(fileUploadButton , 'disabled' , '' , true);

  /** Validation Status Text 1 : **/
  customButtonElement.textContent = statusTextLocal.chooseAFile;
  fileTextElement.textContent = statusTextLocal.isFileUploadRequired;

  return; }

else {

  /** Validation 2: When a file is choosen, valid and pass this condition for the first time. If the user decide to change the input file and select no file,
  the .disabled class is added to and disabled property for the fileUploadButton is set to true. However, the button might still be disabled before 
  performing the next validation before eventually setting the disabled property to false if it eventually pass some test in the next validations **/
  setClassAndDisableElement(fileUploadButton , 'disabled' , '' , true);

  /** This chooseAFile property of 'statusText' object is applied when a user want change a file but later decide to cancel selection 
  and resulting to no file selected. This setting is also applied because the input might be optional while the one in Validation Status Text 1 applies
  when the input is required **/
  customButtonElement.textContent = statusTextLocal.chooseAFile;
  fileTextElement.textContent = statusTextLocal.isFileUploadOptional; }


if (validationStatus.failed === false) validateObjectFileSize(files[0] , fileUploadButton , fileTextElement , requiredUploadFileSize , customButtonElement , validationStatus);
if (validationStatus.failed === false) validateObjectType(files[0] , fileUploadButton , fileTextElement , customButtonElement , validationStatus);
if (validationStatus.failed === false) validateObjectSignature(files[0] , fileUploadButton , fileTextElement , customButtonElement , validationStatus);
  fileUploadButton.onclick = getObjectS3Hash(files[0] , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , validationStatus , uploadUrlElement);

}); }); });


function cancelFileUpload(fileUploader) {
  return function(event) {
  stopDefault(event);
  fileUploader.abort();
} }

function getObjectS3Hash(choosenFile , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , validationStatus , uploadUrlElement) {

  return function(event) {
    stopDefault(event);
    let hashDetailsFetcher = new XMLHttpRequest();
    hashDetailsFetcher.open('POST' , uploadUrlElement.value + 'hash/' + encodeURIComponent(choosenFile.name));
    hashDetailsFetcher.setRequestHeader('Content-Type' , 'application/json');

hashDetailsFetcher.onload = function(response) {
  let responseBody = JSON.parse(response.target.responseText);

  if (response.target.status == 200) { uploadObject(choosenFile , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , responseBody , uploadUrlElement);  
  return; }
  fileTextElement.textContent = statusText.fileUploadError;
}

hashDetailsFetcher.onerror = function(response) { fileTextElement.textContent = statusText.fileUploadError; }

let objectInfo = { 'fileName' : choosenFile.name , 'contentType' : choosenFile.type , '_csrf' : csrfToken };
objectInfo = JSON.stringify(objectInfo);
hashDetailsFetcher.send(objectInfo); }

};

function uploadObject(choosenFile , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , hashDetails , uploadUrlElement) {

  let fileUploader = new XMLHttpRequest();
  setClassAndDisableElement(customButtonElement , 'disabled' , '' , true);
  setClassAndDisableElement(fileUploadButton , 'disabled' , '' , true);
  setElementDisplay(fileUploadButton , 'none');
  setClassAndDisableElement(fileUploadButtonCancel , '' , 'disabled' , false);
  setElementDisplay(fileUploadButtonCancel , 'inline-block');
  fileUploadButtonCancel.onclick = cancelFileUpload(fileUploader);
  fileTextElement.textContent = statusText.fileUploadInProgress;

  let formData = new FormData();

  for (let key in hashDetails.fields) { formData.append(key , hashDetails.fields[key]); }

  formData.append('file' , choosenFile);

fileUploader.upload.onprogress = function(event) {

if (event.lengthComputable) {
  let percentComplete = event.loaded / event.total;
  percentComplete = parseInt(percentComplete * 100);
  let progress = Math.round(percentComplete);
  fileTextElement.textContent = statusText.fileUploadInProgress + progress; } 
};

fileUploader.upload.onload = function(event) { };

fileUploader.upload.onerror = function(event) {
  onFileUploadErrorOrTimeoutOrAbort(fileUploadButton , fileUploadButtonCancel , customButtonElement);
  fileTextElement.textContent = statusText.fileUploadError; 
};

fileUploader.upload.onabort = function(event) {
  onFileUploadErrorOrTimeoutOrAbort(fileUploadButton , fileUploadButtonCancel , customButtonElement);
  fileTextElement.textContent = statusText.fileUploadAbort; };

fileUploader.upload.ontimeout = function(event) {

  onFileUploadErrorOrTimeoutOrAbort(fileUploadButton , fileUploadButtonCancel , customButtonElement);
  fileTextElement.textContent = statusText.fileUploadTimeout; };

fileUploader.onload = function(response) {
if (response.target.readyState == 4 && response.target.status == 201) {

let internalUpload = new XMLHttpRequest();
internalUpload.open('POST' , uploadUrlElement.value + 'save');
internalUpload.setRequestHeader('X-Requested-With' , 'XMLHttpRequest');
internalUpload.setRequestHeader('Accept' , 'application/json');
internalUploadBody = {'key' : hashDetails.fields['key'] , 'mimetype' : hashDetails.fields['Content-Type'] , 'location' : hashDetails.url + '/' + hashDetails.fields['key'] , 'size' : choosenFile.size};
internalUpload.setRequestHeader('Content-Type' , 'application/json');


for (let x in document.forms[0]) { let elem = document.forms[0][x];

    if (elem !== null && elem.constructor.name == 'HTMLInputElement') { internalUploadBody[elem.name] = elem.value; } }

internalUploadBody['_csrf'] = csrfToken;
internalUploadBody = JSON.stringify(internalUploadBody);
internalUpload.send(internalUploadBody);

internalUpload.onload = function(response) { return true; } 

internalUpload.onloadend = function(response) {
  if (response.target.status !== 200 && response.target.status !== 201) {
    setClassAndDisableElement(customButtonElement , '' , 'disabled' , false);
    setClassAndDisableElement(fileUploadButton , '' , 'disabled' , false);
    setElementDisplay(fileUploadButton , 'inline-block');
    setElementDisplay(fileUploadButtonCancel , 'none');
    setClassAndDisableElement(fileUploadButtonCancel , 'disabled' , '' , true);

    let deleteSuccessfulUploadFromS3 = new XMLHttpRequest();
    deleteSuccessfulUploadFromS3.setRequestHeader('Content-Type' , 'application/json');
    deleteSuccessfulUploadFromS3.open('DELETE' , uploadUrlElement.value + 'internal-delete/' + hashDetails.fields['key']);
    let deleteSuccessfulUploadFromS3Body = JSON.stringify({'_csrf' : csrfToken});
    deleteSuccessfulUploadFromS3.send(deleteSuccessfulUploadFromS3Body);
    fileTextElement.textContent = statusText.fileUploadError;
    return; }

  setClassAndDisableElement(fileUploadButtonCancel , 'disabled' , '' , true);
  setElementDisplay(fileUploadButtonCancel , 'none');
  setClassAndDisableElement(fileUploadButtonDelete , '' , 'disabled' , false);
  setElementDisplay(fileUploadButtonDelete , 'inline-block');

  fileTextElement.textContent = statusText.fileUploadSuccess;

fileUploadButtonDelete.onclick = deleteObject(choosenFile , fileUploadButton , fileTextElement , fileUploadButtonCancel , fileUploadButtonDelete , customButtonElement , hashDetails.fields.key , uploadUrlElement);
} 

}

else if (response.target.status == 400 || response.target.status == 403) { 
  setClassAndDisableElement(customButtonElement , '' , 'disabled' , false);
  setClassAndDisableElement(fileUploadButton , '' , 'disabled' , false);
  setElementDisplay(fileUploadButton , 'inline-block');
  setElementDisplay(fileUploadButtonCancel , 'none');
  setClassAndDisableElement(fileUploadButtonCancel , 'disabled' , '' , true);
  fileTextElement.textContent = statusText.fileUploadError; }
};

fileUploader.onloadend = function(response) {
  if (response.target.status === 0) {
  setClassAndDisableElement(customButtonElement , '' , 'disabled' , false);
  setClassAndDisableElement(fileUploadButton , '' , 'disabled' , false);
  setElementDisplay(fileUploadButton , 'inline-block');
  setElementDisplay(fileUploadButtonCancel , 'none');
  setClassAndDisableElement(fileUploadButtonCancel , 'disabled' , '' , true);
  fileTextElement.textContent = statusText.fileUploadError + " or you have cancelled the upload and will have to try again"; }
}

fileUploader.open('POST' , hashDetails.url);
fileUploader.send(formData); 

};