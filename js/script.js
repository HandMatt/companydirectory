let selectedEmployee = {}
const employeeDisplayModal = new bootstrap.Modal(document.getElementById('employeeDisplayModal'));
const addEmployeeModal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
const editEmployeeModal = new bootstrap.Modal(document.getElementById('employeeEditModal'));
const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
const manageDBModal = new bootstrap.Modal(document.getElementById('dbManagementModal'));
const manageLDModal = new bootstrap.Modal(document.getElementById('manageLDModal'));
const confirmModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

function populateTable() {
  $.getJSON('libs/php/getAllPersonnel.php')
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
      <tr onclick="showEmployee(${db[i].id})">
        <th scope="row" class="d-none">${db[i].id}</th>
        <td><b>${db[i].lastName}</b>, ${db[i].firstName}</td>
        <td class="d-none d-lg-table-cell">${db[i].jobTitle}</td>
        <td class="d-none d-lg-table-cell">${db[i].email}</td>
        <td class="d-none d-sm-table-cell">${db[i].department}</td>
        <td class="d-none d-md-table-cell">${db[i].location}</td>
      </tr>
    `);
  }

    function showEmployee(employeeId) {
      $.getJSON(`libs/php/getEmployeeByID.php?id=${employeeId}`)
        .done(function(JSON) {
          selectedEmployee = JSON.data.employee[0];
          $('#employeeDisplayModalLabel').text(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
          $('#employeeEditModalLabel').text(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);          
          $('#employeeFirstName').text(`${selectedEmployee.firstName}`);
          $('#editFirstName').val(`${selectedEmployee.firstName}`);
          $('#employeeLastName').text(`${selectedEmployee.lastName}`);
          $('#editLastName').val(`${selectedEmployee.lastName}`);
          $('#employeeJobTitle').text(`${selectedEmployee.jobTitle}`);
          $('#editJobTitle').val(`${selectedEmployee.jobTitle}`);
          $('#employeeEmail').text(`${selectedEmployee.email}`);
          $('#editEmail').val(`${selectedEmployee.email}`);
          $('#employeeDepartment').text(`${selectedEmployee.department}`);
          $('#editDepartment').val(`${selectedEmployee.departmentID}`);
          $('#employeeLocation').text(`${selectedEmployee.location}`);
        });
      if ($(window).width() < 992) {
        employeeDisplayModal.show();
      } else {
        editEmployeeModal.show();
      }
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

function updateEmployee() {
  $.ajax({
    data: {
      'id': selectedEmployee.id,
      'firstName': properNoun($('#editFirstName').val()),
      'lastName': properNoun($('#editLastName').val()),
      'jobTitle': properNoun($('#editJobTitle').val()),
      'email': $('#editEmail').val(),
      'departmentID': $('#editDepartment').val()
    },
    url: 'libs/php/updateEmployee.php', 
    dataType: 'json',
    success: function() {
      editEmployeeModal.hide();
      populateTable();
      showEmployee(selectedEmployee.id);
    }
  })
}

function updateDepartment(departmentID, selectedDepartment, newName, locationID, selectedLocation) {  
  $.ajax({
    data: {
      'id': departmentID,
      'name': newName,
      'locationID': locationID
    },
    url: 'libs/php/updateDepartment.php',
    dataType: 'json',
    success: function() {
      populateTable();
      populateDepartmentDatalist();
      populateLocationDatalist();
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${selectedDepartment} renamed as ${newName} in ${selectedLocation}`);
      confirmModal.hide();
      feedbackModal.show();
    } 
  });
}

function updateLocation(locationID, selectedLocation, newName) {
  $.ajax({
    data: {
      'id': locationID,
      'name': newName
    },
    url: 'libs/php/updateLocation.php',
    dataType: 'json',
    success: function() {
      populateTable();
      populateDepartmentDatalist();
      populateLocationDatalist();
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${selectedLocation} renamed as ${newName}.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    } 
  });
}

function addEmployee() {
  $.ajax({
    data: {
        'firstName': properNoun($('#addFirstName').val()),
        'lastName': properNoun($('#addLastName').val()),
        'jobTitle': properNoun($('#addJobTitle').val()),
        'email': $('#addEmail').val(),
        'departmentID': $('#addDepartment').val()
    },
    url: 'libs/php/insertEmployee.php', 
    dataType: 'json',
    success: function() {
      populateTable();
      $('#feedbackModal .btn-secondary').off()
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${properNoun($('#addFirstName').val())} ${properNoun($('#addLastName').val())} added to directory.</p>`);
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
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${properNoun($('#addDepartmentName').val())} added to directory.</p>`);
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
    success: function() {
      populateLocationDatalist();
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${properNoun($('#addLocationName').val())} added to directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function deleteEmployee() {
  $.ajax({
    data: {
      id: selectedEmployee.id
    },
    url: 'libs/php/deleteEmployeeByID.php',
    dataType: 'json',
    success: function() {
      populateTable()
      $('#feedbackModal .btn-secondary').off()
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${selectedEmployee.firstName} ${selectedEmployee.lastName} removed from directory.</p>`);
      confirmModal.hide();
      feedbackModal.show();
    }
  })
}

function deleteDepartment(departmentID, selectedDepartment) {
  $.ajax({
    data: {
      'id': departmentID,
    },
    url: 'libs/php/deleteDepartmentByID.php', 
    dataType: 'json',
    success: function() {
      populateDepartmentDatalist();
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${selectedDepartment} removed from directory.</p>`);
    }
  })
  confirmModal.hide();
  feedbackModal.show();
}

function deleteLocation(locationID, selectedLocation) {
  $.ajax({
    data: {
      'id': locationID,
    },
    url: 'libs/php/deleteLocationByID.php', 
    dataType: 'json',
    success: function() {
      populateLocationDatalist();
      $('#feedbackModal .btn-secondary').off();
      $('#feedbackModal .btn-secondary').click(() => {
        feedbackModal.hide();
        manageDBModal.show();
      });
      $('#feedbackModalLabel').html('Success');
      $('#feedbackModal .modal-body').html(`<p class="text-break">${selectedLocation} removed from directory.</p>`);
    }
  })
  confirmModal.hide();
  feedbackModal.show();
}

function checkDepartment(departmentID) {
  $.ajax({
    data: {
      id: departmentID
    },
    url: 'libs/php/personnelInDepartment.php',
    dataType: 'json',
    success: function(JSON) {
      let personnelCount = JSON.data[0].pc;
      let selectedDepartment = $("#manageLDModal .departmentDD option[value='" + departmentID + "']").text()
      if (personnelCount > 0) {
        $('#feedbackModalLabel').html('Failed')
        $('#feedbackModal .modal-body').html(`<p class="text-break">Unable to remove ${selectedDepartment} from directory as there are linked staff.</p>`);
        $('#feedbackModal .btn-secondary').off();
        $('#feedbackModal .btn-secondary').click(() => {
          feedbackModal.hide();
          manageLDModal.show();
        });
        manageLDModal.hide();
        feedbackModal.show();
      } else {
        $('#confirmationModal .modal-body').html(`
          <p class="text-break">Are you sure you wish to delete ${selectedDepartment} from directory?</p>
        `);
        $('#noConfirm').removeClass('btn-secondary');
        $('#noConfirm').addClass('btn-primary');
        $('#noConfirm').off();
        $('#noConfirm').click(() => {
          confirmModal.hide();
          manageLDModal.show();
          $('#noConfirm').removeClass('btn-primary');
          $('#noConfirm').addClass('btn-secondary');
          $('#yesConfirm').removeClass('btn-secondary');
          $('#yesConfirm').addClass('btn-primary');
        });
        $('#yesConfirm').removeClass('btn-primary');
        $('#yesConfirm').addClass('btn-secondary');
        $('#yesConfirm').off();
        $('#yesConfirm').html('Delete');
        $('#yesConfirm').click(() => {
          deleteDepartment(departmentID, selectedDepartment);
          $('#noConfirm').removeClass('btn-primary');
          $('#noConfirm').addClass('btn-secondary');
          $('#yesConfirm').removeClass('btn-secondary');
          $('#yesConfirm').addClass('btn-primary');
        })
        manageLDModal.hide();
        confirmModal.show();
      }
    }
  });
}

function checkLocation(locationID) {
  $.ajax({
    data: {
      id: locationID
    },
    url: 'libs/php/departmentsInLocation.php',
    dataType: 'json',
    success: function(JSON) {
      let departmentCount = JSON.data[0].dc;
      let selectedLocation = $("#manageLDModal .locationDD option[value='" + locationID + "']").text()
      if (departmentCount > 0) {
        $('#feedbackModalLabel').html('Failed');
        $('#feedbackModal .modal-body').html(`<p class="text-break">Unable to remove ${selectedLocation} from directory as there are linked departments.</p>`);        
        $('#feedbackModal .btn-secondary').off();
        $('#feedbackModal .btn-secondary').click(() => {
          feedbackModal.hide();
          manageLDModal.show();
        });        
        manageLDModal.hide();
        feedbackModal.show();
      } else {
        $('#confirmationModal .modal-body').html(`
          <p class="text-break">Are you sure you wish to delete ${selectedLocation} from directory?</p> 
        `);
        $('#noConfirm').removeClass('btn-secondary');
        $('#noConfirm').addClass('btn-primary');
        $('#noConfirm').off();
        $('#noConfirm').click(() => {
          confirmModal.hide();
          manageLDModal.show();
          $('#noConfirm').removeClass('btn-primary');
          $('#noConfirm').addClass('btn-secondary');
          $('#yesConfirm').removeClass('btn-secondary');
          $('#yesConfirm').addClass('btn-primary');
        });
        $('#yesConfirm').removeClass('btn-primary');
        $('#yesConfirm').addClass('btn-secondary');
        $('#yesConfirm').off();
        $('#yesConfirm').html('Delete');
        $('#yesConfirm').click(() => {
          deleteLocation(locationID, selectedLocation);
          $('#noConfirm').removeClass('btn-primary');
          $('#noConfirm').addClass('btn-secondary');
          $('#yesConfirm').removeClass('btn-secondary');
          $('#yesConfirm').addClass('btn-primary');
        })
        manageLDModal.hide();
        confirmModal.show();
      }
    }
  });
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

$('.displayAddEmployee').click(() => {
  manageDBModal.hide();
  addEmployeeModal.show();
});

$('#addEmployeeBtn').click(() => {
  let val = $('#addDepartment').val();
  let selectedDepartment = $("#employeeEditModal .departmentDD option[value='" + val + "']").text()
  $('#confirmationModal .modal-body').html(`
    <p class="text-break">Are you sure you wish to add ${properNoun($('#addFirstName').val())} ${properNoun($('#addLastName').val())} with the following information?</p>
    <div class="d-flex flex-column">
      <small>First Name</small>
      <span>${properNoun($('#addFirstName').val())}</span>
    </div>
    <hr class="my-1">
    <div class="d-flex flex-column">
      <small>Last Name</small>
      <span>${properNoun($('#addLastName').val())}</span>
    </div>
    <hr class="my-1">
    <div class="d-flex flex-column">
      <small>Job Title</small>
      <span>${properNoun($('#addJobTitle').val())}</span>
    </div>
    <hr class="my-1">
    <div class="d-flex flex-column">
      <small>Email</small>
      <span>${$('#addEmail').val()}</span>
    </div>
    <hr class="my-1">
    <div class="d-flex flex-column">
      <small>Department</small>
      <span>${selectedDepartment}</span>
    </div>
  `);
  $('#noConfirm').off();
  $('#noConfirm').click(() => {
    confirmModal.hide();
    addEmployeeModal.show();
  });
  $('#yesConfirm').off();
  $('#yesConfirm').html('Add');
  $('#yesConfirm').click(() => {
    addEmployee();
  })
  addEmployeeModal.hide();
  confirmModal.show();
})

$('#employeeEditModal #saveDataBtn').click(() => {
  updateEmployee();
});

$('#deleteBtn').click(() => {
  $('#confirmationModal .modal-body').html(`
  <p class="text-break">Are you sure you wish to remove ${selectedEmployee.firstName} ${selectedEmployee.lastName} from directory?</p>
  `);
  $('#noConfirm').removeClass('btn-secondary');
  $('#noConfirm').addClass('btn-primary');
  $('#noConfirm').off();
  $('#noConfirm').click(() => {
    confirmModal.hide();
    editEmployeeModal.show();
    $('#noConfirm').removeClass('btn-primary');
    $('#noConfirm').addClass('btn-secondary');
    $('#yesConfirm').removeClass('btn-secondary');
    $('#yesConfirm').addClass('btn-primary');
  });
  $('#yesConfirm').removeClass('btn-primary');
  $('#yesConfirm').addClass('btn-secondary');
  $('#yesConfirm').off();
  $('#yesConfirm').html('Delete');
  $('#yesConfirm').click(() => {
    deleteEmployee();
    $('#noConfirm').removeClass('btn-primary');
    $('#noConfirm').addClass('btn-secondary');
    $('#yesConfirm').removeClass('btn-secondary');
    $('#yesConfirm').addClass('btn-primary');
  })
  editEmployeeModal.hide();
  confirmModal.show();
});

$('#editEmployeeDataBtn').click(() => {
  $('#employeeEditModalLabel').text(`${selectedEmployee.firstName} ${selectedEmployee.lastName}`);
  $('#editFirstName').val(`${selectedEmployee.firstName}`);
  $('#editLastName').val(`${selectedEmployee.lastName}`);
  $('#editJobTitle').val(`${selectedEmployee.jobTitle}`);
  $('#editEmail').val(`${selectedEmployee.email}`);
  $('#editDepartment').val(`${selectedEmployee.departmentID}`);
  employeeDisplayModal.hide();
  editEmployeeModal.show();
});

$('#displayDBManagement').click(() => {
  manageDBModal.show();
});

$('#manageLDModal .btn-secondary').click(() => {
  manageLDModal.hide();
  manageDBModal.show();
});

$('#displayEditDepartment').click(() => {
  $('#manageLDModalLabel').text('Edit Department');
  $('#manageLDSubmit').text('Update');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    let depID = $('#selectedDepartment').val();
    let selectedDepartment = $("#manageLDModal .departmentDD option[value='" + depID + "']").text();
    let newName = properNoun($('#addDepartmentName').val());
    let locID = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + locID + "']").text();
    $('#confirmationModal .modal-body').html(`
      <p class="text-break">Are you sure you wish to update ${selectedDepartment} with the following information?</p>
      <div class="d-flex flex-column">
        <small>Department Name</small>
        <span>${newName}</span>
      </div>
      <hr class="my-1">
      <div class="d-flex flex-column">
        <small>New Location</small>
        <span>${selectedLocation}</span>
      </div>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').html('Update');
    $('#yesConfirm').click(() => {
      updateDepartment(depID, selectedDepartment, newName, locID, selectedLocation);
    })
    manageLDModal.hide();
    confirmModal.show();
  })
  $('#departmentName').toggle(true);
  $('#departmentSelect').toggle(true);
  $('#locationName').toggle(false);
  $('#locationSelect').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();  
})

$('#displayAddDepartment').click(() => {
  $('#manageLDModalLabel').text('Add Department');
  $('#manageLDSubmit').text('Add');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + val + "']").text()
    $('#confirmationModal .modal-body').html(`
      <p class="text-break">Are you sure you wish to add ${properNoun($('#addDepartmentName').val())} in ${selectedLocation} as a new department to directory?</p>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').html('Add');
    $('#yesConfirm').click(() => {
      addDepartment();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('#departmentName').toggle(true);
  $('#departmentSelect').toggle(false);
  $('#locationName').toggle(false);
  $('#locationSelect').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayDeleteDepartment').click(() => {
  $('#manageLDModalLabel').text('Delete Department');
  $('#manageLDSubmit').text('Delete');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedDepartment').val();
    checkDepartment(val);
  });
  $('#departmentName').toggle(false);
  $('#departmentSelect').toggle(true);
  $('#locationName').toggle(false);
  $('#locationSelect').toggle(false);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayEditLocation').click(() => {
  $('#manageLDModalLabel').text('Edit Location');
  $('#manageLDSubmit').text('Update');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    let locID = $('#selectedLocation').val();
    let selectedLocation = $("#manageLDModal .locationDD option[value='" + locID + "']").text();
    let newName = properNoun($('#addLocationName').val());
    $('#confirmationModal .modal-body').html(`
      <p class="text-break">Are you sure you wish to update ${selectedLocation} to ${newName}?</p>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').html('Update');
    $('#yesConfirm').click(() => {
      updateLocation(locID, selectedLocation, newName);
    })
    manageLDModal.hide();
    confirmModal.show();
  })
  $('#departmentName').toggle(false);
  $('#departmentSelect').toggle(false);
  $('#locationName').toggle(true);
  $('#locationSelect').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();  
})

$('#displayAddLocation').click(() => {
  $('#manageLDModalLabel').text('Add Location');
  $('#manageLDSubmit').text('Add');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    $('#confirmationModal .modal-body').html(`
      <p class="text-break">Are you sure you wish to add ${properNoun($('#addLocationName').val())} as a new location to directory?</p>
    `);
    $('#noConfirm').off();
    $('#noConfirm').click(() => {
      confirmModal.hide();
      manageLDModal.show();
    });
    $('#yesConfirm').off();
    $('#yesConfirm').html('Add');
    $('#yesConfirm').click(() => {
      addLocation();
    })
    manageLDModal.hide();
    confirmModal.show();
  });
  $('#departmentName').toggle(false);
  $('#departmentSelect').toggle(false);
  $('#locationName').toggle(true);
  $('#locationSelect').toggle(false);
  manageDBModal.hide();
  manageLDModal.show();
});

$('#displayDeleteLocation').click(() => {
  $('#manageLDModalLabel').text('Delete Location');
  $('#manageLDSubmit').text('Delete');
  $('#manageLDSubmit').off();
  $('#manageLDSubmit').click(() => {
    let val = $('#selectedLocation').val();
    checkLocation(val);
  });
  $('#departmentName').toggle(false);
  $('#departmentSelect').toggle(false);
  $('#locationName').toggle(false);
  $('#locationSelect').toggle(true);
  manageDBModal.hide();
  manageLDModal.show();
});

$(document).ready(() => {
  populateTable();
  populateDepartmentDatalist();
  populateLocationDatalist();
  $('#preload').hide();
});