let deleteOptionElms = document.querySelectorAll('.delete-option');
let deleteEntryStatusElms = document.querySelectorAll('.entries-delete-status');
let deleteEntriesUrl = window.location.href.split('/').slice(3 , 5);
let deleteList = [];
deleteEntriesUrl.push(...["delete" , "entries" , "many"]);
deleteEntriesUrl = deleteEntriesUrl.join('/');
var _csrf = document.querySelector("input[name=_csrf]");
var csrfToken = null;
if (_csrf !== null) csrfToken = _csrf.value;

if (deleteOptionElms !== null) {

  deleteOptionElms.forEach((deleteOptElem) => {

deleteOptElem.addEventListener('click' , (evt) => {

let items = document.querySelectorAll('input[name=entry_item]:checked');
let itemsParent = document.querySelector('.entries tbody');

  if (deleteEntryStatusElms !== null && items !== null) {
    if (items.length < 1) { actionEntryStatusElmsProps(deleteEntryStatusElms , 'No entries to delete.' , 'red'); }
     else if (items.length > 0) {

      items.forEach((item) => { deleteList.push(item.value); });
      actionEntryStatusElmsProps(deleteEntryStatusElms , 'Please wait or be patient....' , 'blue'); 
      disableElms(deleteOptionElms , true);

      let xhr = new XMLHttpRequest();
      xhr.open('POST' , "/" + deleteEntriesUrl , true);
      xhr.withCredentials = false;
      xhr.setRequestHeader('Content-Type' , 'application/json');
      let body = JSON.stringify({"entries" : deleteList , "_csrf" : csrfToken });
      xhr.send(body);

      xhr.onload = function(resp) {
        disableElms(deleteOptionElms , false);

        if (resp.target.status == 200) { actionEntryStatusElmsProps(deleteEntryStatusElms , 'Action Successful!!!' , 'green');
          deleteList = [];
          items.forEach((itemElm) => {
            itemsParent.removeChild(itemElm.closest('tr')); }); }
        else if (resp.target.status == 404 || resp.target.status == 400) { actionEntryStatusElmsProps(deleteEntryStatusElms , 'Action Unsuccessful!!!' , 'red'); 

        deleteList = []; }
        else { actionEntryStatusElmsProps(deleteEntryStatusElms , 'Error has occured!!!' , 'red'); 
          deleteList = []; } 
      }

        xhr.onerror = function(evt) {
          disableElms(deleteOptionElms , false);
          actionEntryStatusElmsProps(deleteEntryStatusElms , 'Error has occured!!!' , 'red'); 
          deleteList = [];
        }
 }

 } });  });

}

