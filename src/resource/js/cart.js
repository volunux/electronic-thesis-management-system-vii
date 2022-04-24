let showSnackbarButton = document.querySelectorAll('#showsnackbarbutton');

showSnackbarButton.forEach((element) => {

element.addEventListener('click' , function(event) {

  event.stopPropagation();
  event.preventDefault();

  let request = new XMLHttpRequest();
  request.open('POST' , '/cart' , true);
  request.setRequestHeader('Content-Type' , 'application/json');
  let element = event.target;

  element.className = 'btn-add-to-cart btn-purple';
  element.innerHTML = "<span class ='fa fa-spinner fa-spin'></span> Processing...";
  let parent = element.closest('form');
  element.disabled = true;

  let entry = {};

  for (let input of parent) { entry[input.name] = input.value; }

    setTimeout(function() { request.send(JSON.stringify(entry)); } , 3000)

  request.onloadend = function(response) {
    if (response.target.status === 200) { 
      element.className = 'btn-add-to-cart btn-green';
      element.innerHTML = "<span class ='fa fa-check'></span> Added to Cart"; 
      element.disabled = true; }
    else {
      element.className = 'btn-add-to-cart btn-red';
      element.innerHTML = "<span class ='fa fa-bomb'></span> Failed...";
      element.disabled = false;

  addToWishListButton(element); } } });
});

function addToWishListButton(element) {

  setTimeout(function() { 
    element.className = 'btn-add-to-cart btn-blue';
    element.innerHTML = "<span class ='fa fa-book'></span> Add to Wishlist"; }, 2000);
}
