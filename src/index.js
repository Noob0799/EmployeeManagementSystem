(() => {
   const employeeListBody = document.querySelector('.employee-info-body-list-body');
   const employeeDisplayBody = document.querySelector('.employee-info-body-display-body');
   const addOrEditEmployeeModal = document.querySelector('.employee-add-edit-modal');
   const addOrEditEmployeeForm = document.querySelector('.employee-add-edit-form');
   let employeeList = [], lastEmployeeId = 0, lastUpdatedEmployeeId = 0;

   const handleDisplayEmployeeInfo = (id) => {
    let employeeInfo = {};
    employeeList.forEach(employee => {
        if(employee.id == id) {
            employeeInfo = JSON.parse(JSON.stringify(employee));
        }
    });
    if(!employeeInfo.imageUrl) employeeInfo.imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnUyF77H4RFWR1h0IiKmeV3IGySppR1I3zkw&s';
    employeeDisplayBody.innerHTML = `
        <img src=${employeeInfo.imageUrl} alt="Image of ${employeeInfo.firstName} ${employeeInfo.lastName}"/>
        <div class="employee-name">
            <span><h1>${employeeInfo.firstName} ${employeeInfo.lastName}</h1></span>
            <i class="fa fa-edit edit-employee-btn" data-employee-id="${employeeInfo.id}"></i>
        </div>
        <span><b>Address:</b> ${employeeInfo.address}</span>
        <span><b>Number:</b> ${employeeInfo.mobileNumber}</span>
        <span><b>Salary:</b> Rs ${employeeInfo.salary}</span>
    `;
    document.querySelector('.edit-employee-btn').addEventListener('click', (event) => renderAddOrEditEmployeeModal(true, 'edit', event.target.dataset.employeeId));
   }

   const renderEmployeeItem = (employee, index, totalLength) => { 
    let element = document.createElement('div');
    element.setAttribute('id', employee.id);
    element.classList.add('employee-item');
    if((lastUpdatedEmployeeId > 0 && employee.id == lastUpdatedEmployeeId)
        || (lastUpdatedEmployeeId == 0 && index == totalLength - 1)) {
        element.classList.add('selected');
        handleDisplayEmployeeInfo(employee.id);
    }
    element.innerHTML = `<span>${employee.firstName} ${employee.lastName}</span><i class="fa fa-trash-o employee-delete" ></i>`;
    employeeListBody.append(element);
   }

   const getEmployeeList = () => {
    employeeListBody.innerHTML = '';
    employeeDisplayBody.innerHTML = '';
    lastEmployeeId = 0;
    employeeList = JSON.parse(sessionStorage.getItem('employeeList'));
    if(employeeList && employeeList.length) {
        employeeList.forEach((employee, index) => {
            renderEmployeeItem(employee, index, employeeList.length);
        });
        lastEmployeeId = employeeList[employeeList.length - 1].id;
    }
   }
   getEmployeeList();

   const renderAddOrEditEmployeeModal = (show, mode = 'add', id = null) => {
    let header = addOrEditEmployeeForm.querySelector('.employee-add-edit-header'),
        employeeInfo = {},
        employeeId = addOrEditEmployeeForm.querySelector('input[name="id"]'),
        firstName = addOrEditEmployeeForm.querySelector('input[name="firstName"]'),
        lastName = addOrEditEmployeeForm.querySelector('input[name="lastName"]'),
        imageUrl = addOrEditEmployeeForm.querySelector('input[name="imageUrl"]'),
        address = addOrEditEmployeeForm.querySelector('input[name="address"]'),
        mobileNumber = addOrEditEmployeeForm.querySelector('input[name="mobileNumber"]'),
        salary = addOrEditEmployeeForm.querySelector('input[name="salary"]');

    addOrEditEmployeeForm.reset();
    if(show) {
        if(mode === 'add') {
            header.innerHTML = "Add Employee Details";
        } else {
            header.innerHTML = "Edit Employee Details";
            firstName.setAttribute('readonly', true);
            lastName.setAttribute('readonly', true);
            if(id) {
                employeeList.forEach(employee => {
                    if(employee.id == id) {
                        employeeInfo = JSON.parse(JSON.stringify(employee));
                    }
                });
                employeeId.value = employeeInfo.id;
                firstName.value = employeeInfo.firstName;
                lastName.value = employeeInfo.lastName;
                imageUrl.value = employeeInfo.imageUrl;
                address.value = employeeInfo.address;
                mobileNumber.value = employeeInfo.mobileNumber;
                salary.value = employeeInfo.salary;
            }
        }
    }
    addOrEditEmployeeModal.style.display = show ? 'flex' : 'none';
   }

   const handleModalClick = (event) => {
    const target = event.target;
    if(target.classList.contains('employee-add-edit-modal')) {
        renderAddOrEditEmployeeModal(false);
    }
   }

   const addOrEditEmployeeSubmit = (event) => {
    event.preventDefault();
    let formData = new FormData(addOrEditEmployeeForm);
    const employee = {};
    [...formData].forEach(arr => {
        employee[arr[0]] = arr[1];
    });
    if(!employee['id']) {
        employee['id'] = lastEmployeeId + 1;
        if(employeeList) {
            employeeList.push(employee);
            sessionStorage.setItem('employeeList', JSON.stringify(employeeList));
        } else {
            sessionStorage.setItem('employeeList', JSON.stringify([employee]));
        }
    } else {
        employeeList.map(emp => {
            if(emp['id'] == employee['id']) {
                emp.firstName = employee.firstName;
                emp.lastName = employee.lastName;
                emp.address = employee.address;
                emp.salary = employee.salary;
                emp.mobileNumber = employee.mobileNumber;
                emp.imageUrl = employee.imageUrl;
            }
            return emp;
        });
        sessionStorage.setItem('employeeList', JSON.stringify(employeeList));
        lastUpdatedEmployeeId = employee['id'];
    }
    renderAddOrEditEmployeeModal(false);
    getEmployeeList();
   }

   const handleDeleteEmployee = (id) => {
    employeeList = employeeList.filter(employee => employee.id != id);
    sessionStorage.setItem('employeeList', JSON.stringify(employeeList));
    getEmployeeList();
   }

   const resetSelectedEmployee = (element) => {
    const listOfEmployees = [...employeeListBody.children];
    listOfEmployees.forEach(employee => {
        employee.classList.remove('selected');
    });
    element.classList.add('selected');
   }

   const handleEmployeeListClick = (event) => {
    if(employeeList) {
        const target = event.target;
        if(target.classList.contains('employee-delete')) {
            handleDeleteEmployee(target.parentNode.id);
        } else if(target.tagName === 'SPAN') {
            resetSelectedEmployee(target.parentNode);
            handleDisplayEmployeeInfo(target.parentNode.id);
        } else if(target.classList.contains('employee-item')) {
            resetSelectedEmployee(target);
            handleDisplayEmployeeInfo(target.id);
        }
    }
   }

   document.querySelector('.add-employee-btn').addEventListener('click', () => renderAddOrEditEmployeeModal(true, 'add'));
   document.querySelector('.employee-add-edit-modal').addEventListener('click', handleModalClick);
   addOrEditEmployeeForm.addEventListener('submit', addOrEditEmployeeSubmit);
   employeeListBody.addEventListener('click', handleEmployeeListClick);
})();