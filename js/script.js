let selectedContact = {}
const contactDisplayModal = new bootstrap.Modal(document.getElementById('contactDisplayModal'));
const addPersonModal = new bootstrap.Modal(document.getElementById('addPersonModal'));
const editContactModal = new bootstrap.Modal(document.getElementById('contactEditModal'));
const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
const manageDBModal = new bootstrap.Modal(document.getElementById('dbManagementModal'));
const manageLDModal = new bootstrap.Modal(document.getElementById('manageLDModal'));
const confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
const adminLoginModal = new bootstrap.Modal(document.getElementById('adminLoginModal'));

function populateTable() {
  $.getJSON('libs/php/getAll.php')
  .done(function(JSON) {
    $('#database tbody').html('');
    var db = JSON.data;
    for (let i in db) {
      appendEntry(db, i);
    }
  });
}

  function appendEntry(db, i) {
    $('#database tbody').append(`
      <tr onclick="showContact(${db[i].id})">
        <th scope="row" class="d-none">${db[i].id}</th>
        <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
        <td class="d-none d-lg-table-cell">${db[i].jobTitle}</td>
        <td class="d-none d-lg-table-cell">${db[i].email}</td>
        <td class="d-none d-sm-table-cell">${db[i].department}</td>
        <td class="d-none d-md-table-cell">${db[i].location}</td>
      </tr>
    `);
  }

    function showContact(contactId) {
      $.getJSON(`libs/php/getPersonnelByID.php?id=${contactId}`)
      .done(function(JSON) {
        selectedContact = JSON.data.personnel[0];
        $('#contactDisplayModalLabel').text(`${selectedContact.firstName} ${selectedContact.lastName}`);
        $('#contactId').text(`${selectedContact.id}`);
        $('#contactFirstName').text(`${selectedContact.firstName}`);
        $('#contactLastName').text(`${selectedContact.lastName}`);
        $('#contactJobTitle').text(`${selectedContact.jobTitle}`);
        $('#contactEmail').text(`${selectedContact.email}`);
        $('#contactDepartment').text(`${selectedContact.department}`);
        $('#contactLocation').text(`${selectedContact.location}`);
      });
      contactDisplayModal.show();
    }

function populateDepartmentDatalist() {
  $.getJSON('libs/php/getAllDepartments.php')
  .done(function(JSON) {
    $('.departmentDD').html('');
    for(let i=0;i<JSON.data.length;i++){
      $('.departmentDD').append(`
        <option value=${JSON.data[i].id}>${JSON.data[i].name}</option>
      `);
    }
  });
}

function populateLocationDatalist() {
  $.getJSON('libs/php/getAllLocations.php')
  .done(function(JSON) {
    $('.locationDD').html('');
    for(let i=0;i<JSON.data.length;i++){
      $('.locationDD').append(`
        <option value=${JSON.data[i].id}>${JSON.data[i].name}</option>
      `);
    }
  });
}

function properNoun(str) {
  str = str.toLowerCase().replace(/^[\u00C0-\u1FFF\u2C00-\uD7FF\w]|\s[\u00C0-\u1FFF\u2C00-\uD7FF\w]/g, function(letter) {
    return letter.toUpperCase();
  });
  return str;
}

function updatePersonnel() {
  $.ajax({
    data: {
        'id': selectedContact.id,
        'firstName': properNoun($('#ceFirstName').val()),
        'lastName': properNoun($('#ceLastName').val()),
        'jobTitle': properNoun($('#ceJobTitle').val()),
        'email': $('#ceEmail').val(),
        'departmentID': $('#ceDepartment').val()
    },
    url: 'libs/php/updateEmployee.php', 
    dataType: 'json',
    success: function(data) {
      editContactModal.hide();
      populateTable();
      showContact(selectedContact.id);
    }
  })
}

function addPersonnel() {
  $.ajax({
    data: {
        'firstName': properNoun($('#caFirstName').val()),
        'lastName': properNoun($('#caLastName').val()),
        'jobTitle': properNoun($('#caJobTitle').val()),
        'email': $('#caEmail').val(),
        'departmentID': $('#caDepartment').val()
    },
    url: 'libs/php/insertEmployee.php', 
    dataType: 'json',
    success: function() {
      populateTable();
      $('#feedbackModal .modal-body').html(`<p>${properNoun($('#caFirstName').val())} ${properNoun($('#caLastName').val())} added to directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function addDepartment() {
  $.ajax({
    data: {
      'name': properNoun($('#addDepartmentName').val()),
      'locationID': $('#selectedLocation').val()
    },
    url: 'libs/php/insertDepartment.php', 
    dataType: 'json',
    success: function() {
      populateDepartmentDatalist();
      $('#feedbackModal .modal-body').html(`<p>${properNoun($('#addDepartmentName').val())} added to directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function addLocation() {
  $.ajax({
    data: {
      'name': properNoun($('#addLocationName').val()),
    },
    url: 'libs/php/insertLocation.php', 
    dataType: 'json',
    success: function(data) {
      populateLocationDatalist();
      $('#feedbackModal .modal-body').html(`<p>${properNoun($('#addLocationName').val())} added to directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function deletePersonnel() {
  $.ajax({
    data: {
      id: selectedContact.id
    },
    url: 'libs/php/deleteEmployeeByID.php',
    dataType: 'json',
    success: function() {
      populateTable()
      $('#feedbackModal .modal-body').html(`<p>${selectedContact.firstName} ${selectedContact.lastName} removed from directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function deleteDepartment() {
  $.getJSON('libs/php/getAll.php')
  .done(function(JSON) {
    let val = $('#selectedDepartment').val();
    let selectedDepartment = $("#manageLDModal .departmentDD option[value='" + val + "']").text();
    let result = JSON.data.every(function (e) {
      return e.department !== selectedDepartment; 
    });
    if (result) {
      $.ajax({
        data: {
          'id': val,
        },
        url: 'libs/php/deleteDepartmentByID.php', 
        dataType: 'json',
        success: function() {
          populateDepartmentDatalist();
          $('#feedbackModal .modal-body').html(`<p>${selectedDepartment} removed from directory.</p>`);
        }
      })
    } else {
      $('#feedbackModal .modal-body').html(`<p>Unable to remove ${selectedDepartment} from directory.</p>`);
    }
    confirmModal.hide();
    feedbackModal.show();
  });
}

function deleteLocation() {
  $.getJSON('libs/php/getAllDepartments.php')
  .done(function(JSON) {
    let val = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + val + "']").text();
    let result = JSON.data.every(function (e) {
      return e.locationID !== val; 
    });
    if (result) {
      $.ajax({
        data: {
          'id': val,
        },
        url: 'libs/php/deleteLocationByID.php', 
        dataType: 'json',
        success: function() {
          populateLocationDatalist();
          $('#feedbackModal .modal-body').html(`<p>${selectedLocation} removed from directory.</p>`);
        }
      })
    } else {
      $('#feedbackModal .modal-body').html(`<p>Unable to remove ${selectedLocation} from directory.</p>`);
    }
    confirmModal.hide();
    feedbackModal.show();
  });
}

function userLogin() {
  $.ajax({
    data: {
      username: $('#username').val(),
      password: $('#password').val()
    },
    url: 'libs/php/login.php',
    dataType: 'json',
    success: function() {
      $('.displayAddPerson').show();
      $('#displayDBManagement').show();
      $('#editContactDataBtn').show();
      $('#displayLoginBtn').off().text('Logout').on('click', () => {
        logout()
      })
      adminLoginModal.hide()
    },
    error: function() {
      $('#loginError').text("Incorrect username or password");
    }
  })
}

function logout() {
  $('.displayAddPerson').hide();
  $('#displayDBManagement').hide();
  $('#editContactDataBtn').hide();
  $('#displayLoginBtn').off().text('Admin Login').on('click', () => {
    adminLoginModal.show()
  })
}

//Column sort - https://stackoverflow.com/questions/3160277/jquery-table-sort
$('th').click(function(){
  var table = $(this).parents('table').eq(0)
  var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()-1))
  this.asc = !this.asc
  if (!this.asc){rows = rows.reverse()}
  for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
  return function(a, b) {
      var valA = getCellValue(a, index), valB = getCellValue(b, index)
      return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
  }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

//Table search - https://www.webslesson.info/2016/10/search-html-table-data-by-using-jquery.html
$('#search').keyup(function(){  
  search_table($(this).val());  
});  
function search_table(value){  
  $('#database tbody tr').each(function(){  
    var found = 'false';  
    $(this).each(function(){  
      if($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){  
        found = 'true';  
      }  
    });  
    if(found == 'true') {  
      $(this).show();  
    } else {  
      $(this).hide();  
    }  
  });  
}

$('.displayAddPerson').click(() => {
  manageDBModal.hide();
  addPersonModal.show();
});

$('#addPersonBtn').click(() => {
  let val = $('#caDepartment').val();
  let selectedDepartment = $("#contactEditModal .departmentDD option[value='" + val + "']").text()
  $('#confirmationModal .modal-body').html(`
  <p>Are you sure you wish to add ${properNoun($('#caFirstName').val())} ${properNoun($('#caLastName').val())} with the following information?</p>
  <div class="d-flex flex-column">
    <h3 class="fs-4">First Name</h3>
    <span class="text-end">${properNoun($('#caFirstName').val())}</span>
  </div>
  <div class="d-flex flex-column">
    <h3 class="fs-4">Last Name</h3>
    <span class="text-end">${properNoun($('#caLastName').val())}</span>
  </div>
  <div class="d-flex flex-column">
    <h3 class="fs-4">Job Title</h3>
    <span class="text-end">${properNoun($('#caJobTitle').val())}</span>
  </div>
  <div class="d-flex flex-column">
    <h3 class="fs-4">Email</h3>
    <span class="text-end">${$('#caEmail').val()}</span>
  </div>
  <div class="d-flex flex-column">
    <h3 class="fs-4">Department</h3>
    <span class="text-end">${selectedDepartment}</span>
  </div>
  `);
  $('#noConfirm').off();
  $('#noConfirm').click(() => {
    confirmModal.hide();
    addPersonModal.show();
  });
  $('#yesConfirm').off();
  $('#yesConfirm').click(() => {
    addPersonnel();
  })
  addPersonModal.hide();
  confirmModal.show();
})

$('#contactEditModal #saveDataBtn').click(() => {
  updatePersonnel();
});

$('#contactEditModal #deleteBtn').click(() => {
  $('#confirmationModal .modal-body').html(`
  <p>Are you sure you wish to remove ${selectedContact.firstName} ${selectedContact.lastName} from directory?</p>
  `);
  $('#noConfirm').off();
  $('#noConfirm').click(() => {
    confirmModal.hide();
    editContactModal.show();
  });
  $('#yesConfirm').off();
  $('#yesConfirm').click(() => {
    deletePersonnel();
  })
  editContactModal.hide();
  confirmModal.show();
});

$('#contactDisplayModal #editContactDataBtn').click(() => {
  $('#contactEditModalLabel').text(`${selectedContact.firstName} ${selectedContact.lastName}`);
  $('#ceId').text(`${selectedContact.id}`);
  $('#ceFirstName').val(`${selectedContact.firstName}`);
  $('#ceLastName').val(`${selectedContact.lastName}`);
  $('#ceJobTitle').val(`${selectedContact.jobTitle}`);
  $('#ceEmail').val(`${selectedContact.email}`);
  $('#ceDepartment').val(`${selectedContact.departmentID}`);
  $('#ceLocation').val(`${selectedContact.location}`);
  contactDisplayModal.hide();
  editContactModal.show();
});

$('#displayDBManagement').click(() => {
  manageDBModal.show();
});

$('#displayAddDepartment').click(() => {
  $('#manageLDModalLabel').text('Add Department');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').text('Add department');
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + val + "']").text()
    $('#confirmationModal .modal-body').html(`
      <p>Are you sure you wish to add ${properNoun($('#addDepartmentName').val())} in ${selectedLocation} as a new department to directory?</p>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').click(() => {
      addDepartment();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('.department-name').toggle(true);
  $('.department-select').toggle(false);
  $('.location-name').toggle(false);
  $('.location-select').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayDeleteDepartment').click(() => {
  $('#manageLDModalLabel').text('Delete Department');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').text('Remove department');
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedDepartment').val();
    let selectedDepartment = $("#manageLDModal .departmentDD option[value='" + val + "']").text()
    $('#confirmationModal .modal-body').html(`
      <p>Are you sure you wish to delete ${selectedDepartment} from directory?</p>
      <p>Unable to remove departments with linked personnel.</p> 
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').click(() => {
      deleteDepartment();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('.department-name').toggle(false);
  $('.department-select').toggle(true);
  $('.location-name').toggle(false);
  $('.location-select').toggle(false);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayAddLocation').click(() => {
  $('#manageLDModalLabel').text('Add Location');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').text('Add location');
  $('#manageLDSubmit').click(() => {
    $('#confirmationModal .modal-body').html(`
      <p>Are you sure you wish to add ${properNoun($('#addLocationName').val())} as a new location to directory?</p>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').click(() => {
      addLocation();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('.department-name').toggle(false);
  $('.department-select').toggle(false);
  $('.location-name').toggle(true);
  $('.location-select').toggle(false);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayDeleteLocation').click(() => {
  $('#manageLDModalLabel').text('Delete Location');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').text('Remove location');
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + val + "']").text()
    $('#confirmationModal .modal-body').html(`
      <p>Are you sure you wish to delete ${selectedLocation} from directory?</p>
      <p>Unable to remove locations with linked departments.</p> 
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').click(() => {
      deleteLocation();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('.department-name').toggle(false);
  $('.department-select').toggle(false);
  $('.location-name').toggle(false);
  $('.location-select').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayLoginBtn').click(() =>{
  adminLoginModal.show()
})

$('#login').click(() => {
  userLogin()
})

$(document).ready(() => {
  populateTable();
  populateDepartmentDatalist();
  populateLocationDatalist();
})



