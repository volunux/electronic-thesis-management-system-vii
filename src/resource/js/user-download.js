const downloadButtons = document.querySelectorAll('.item-download');

downloadButtons.forEach((item) => {

  item.addEventListener('click' , function(event) {

    let element = event.target;
    let parent = element.parentElement;
    element.className = 'btn-green item-download';

    const downloadEntryStatus = parent.querySelector('.object-download-status');
    let fileUrl = parent.querySelector('form').action;

    stopDefault(event);
    disableElement(element , true);
    setElementVisibility(downloadEntryStatus , 'visible');

  setTimeout(() => {

    const xhr = new XMLHttpRequest();
    xhr.open('GET' , fileUrl  , true);
    xhr.setRequestHeader('Content-Type' , 'application/json');
    xhr.withCredentials = false;
    xhr.send();

    xhr.onload = function(resp) {

    if (resp.target.status === 200) { 

      let responseBody = {}; 

      try { responseBody = JSON.parse(resp.target.response); }
      catch (err) {
        setDownloadButtonOnError(element , downloadEntryStatus);
        disableElement(element , false); }

      if (responseBody.url) {
        fetch(responseBody.url, { method : 'GET'})
        .then((res) => { return res.blob(); })
        .then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = 'myItem.extension';
          document.body.appendChild(a); 
          a.click();
          setTimeout(() => { window.URL.revokeObjectURL(url); } , 1800000); 
          a.remove(); })
        .catch((err) => { })
        .finally(() => { 
          setElementVisibility(downloadEntryStatus , 'hidden'); 
          disableElement(element , false); }); }
        else {
          setDownloadButtonOnError(element , downloadEntryStatus);
          disableElement(element , false); }
   }

    else {

    setDownloadButtonOnError(element , downloadEntryStatus);
    disableElement(element , false); } }

  xhr.onerror = function(evt) {
    setDownloadButtonOnError(element , downloadEntryStatus);
    disableElement(element , false);  }
} , 3000);

  });

});

function setDownloadButtonOnError(element , downloadStatus) {

  setElementVisibility(downloadStatus , 'hidden');
  element.className = 'btn-red item-download';
}