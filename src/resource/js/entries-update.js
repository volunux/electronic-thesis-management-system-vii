let faculty = document.querySelector('select[name=faculty]');
let department = document.querySelector('select[name=department]');
let validationElm = null;

if (faculty !== null) { faculty.addEventListener('change' , function(evt) {

  let parent = evt.target.parentElement;
  var value = evt.target.value;
  let child = parent.querySelector('span[class="bold validation-error"]');

  if (child !== null) parent.removeChild(child);

  if (!value) { removeDepartmentChildren();
    return; };

  validationElm = document.createElement('span');
  validationElm.className = 'bold validation-error';
  validationElm.textContent = "Loading departments.....";
  parent.appendChild(validationElm);

  let request = new XMLHttpRequest();
  request.open('GET' , '/api/department/faculty/entries/' + faculty.value);
  request.setRequestHeader('Content-Type' , 'application/json');
  request.addEventListener('loadend' , function(response) {

      let result = response.target;
        if (result.status !== 200) {
          if (validationElm !== null) parent.removeChild(validationElm);
           setValidationElm(parent); }

        else { removeDepartmentChildren();
          let entries;
          try { entries = JSON.parse(result.response); }
          catch(err) { setValidationElm(parent); }

          for (let entry of entries) {
            let option = document.createElement('option');
            option.text = entry.name;
            option.value = entry._id;
            department.add(option); }

            validationElm.textContent = "Success...";
            validationElm.style.color = "green";
        }
    });
    request.send();
});

}

function removeDepartmentChildren() {
  if (department !== null) { while (department.children.length > 1) { department.removeChild(department.lastChild); } }
}

function setValidationElm(parent) {
  validationElm = document.createElement('span');
  validationElm.className = 'bold validation-error';
  validationElm.textContent = "Failed to load entries";
  parent.appendChild(validationElm);
}