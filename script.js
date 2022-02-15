class Student {
    id;
    name;
    surname;
    email;
    image;
    unievrsityName;
    gender;

    constructor(name, surname, email, image, university) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.image = image;
        this.unievrsityName = university;
        this.gender = 0;
        this.id = "";
    }
}


class ApiWorker {
    apiBaseUrl;
    constructor() {
        this.apiBaseUrl = 'http://stepapi.somee.com/api/Student';
    }

    readAllStudents(renderDataLogic) {
        var http = new XMLHttpRequest();
        http.open("GET", this.apiBaseUrl);
        http.onloadend = function () {
            renderDataLogic(JSON.parse(http.response));
        }
        http.send();
    }


    createStudent(studentItem, resultCheckLogic) {
        var http = new XMLHttpRequest();
        http.open("POST", this.apiBaseUrl);
        http.setRequestHeader("content-type", "application/json");
        http.onloadend = function () {
            resultCheckLogic(JSON.parse(http.response));
        }
        http.send(JSON.stringify(studentItem));
    }

    deleteStudent(studentId, resultCheckLogic) {
        var http = new XMLHttpRequest();
        http.open("Delete", `${this.apiBaseUrl}/${studentId}`);
        http.onloadend = function () {
            resultCheckLogic(JSON.parse(http.response));
        }
        http.send();
    }

    getStudentById(studentId, resultCheckLogic) {
        var http = new XMLHttpRequest();
        http.open("GET", `${this.apiBaseUrl}/${studentId}`);
        http.onloadend = function () {
            resultCheckLogic(JSON.parse(http.response));
        }
        http.send();
    }

    updateStudentInformation(studentId, updateStudentInfo, resultCheck) {
        var http = new XMLHttpRequest();
        http.open("PUT", `${this.apiBaseUrl}/${studentId}`);
        http.setRequestHeader("content-type","application/json");
        http.onloadend = function () {
            resultCheck(JSON.parse(http.response));
        }
        http.send(JSON.stringify(updateStudentInfo));
    }
}

class HtmlWorker {
    apiWorker;

    constructor(apiWorker) {
        this.apiWorker = apiWorker;
        this.initData();
        this.saveStudentData();
    }

    initData() {
        var self = this;
        this.apiWorker.readAllStudents(function (data) {
            self.renderStudentsDataOnView(data);
        });
    }

    getStudentCardHtml(studentItem) {
        return `<div class="card" style="width: 18rem;">
                    <img src="${studentItem.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${studentItem.name} ${studentItem.surname}</h5>
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">${studentItem.email}</li>
                            <li class="list-group-item">${studentItem.unievrsityName}</li>
                        </ul>
                        <a href="#" class="btn btn-success col-md-12">Call</a>
                    </div>
                    <div class="action-btns">
                        <button onclick="viewWorker.deleteStudent(this,'${studentItem.id}')" class="btn btn-danger">
                            <i class="fas fa-times"></i>
                        </button>
                        <button onclick="viewWorker.updateStudent('${studentItem.id}')" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                            <i class="fas fa-marker"></i>
                        </button>
                    </div>
                </div>`
    }

    getStudentUpdateFormHtml(studentItem) {
        return `
                <img src="${studentItem.image}"/>
                <div class="form-group">
                    <label for="">Enter student name</label>
                    <input
                    id="nameUpdate"
                    value="${studentItem.name}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter student surname</label>
                    <input
                    id="surnameUpdate"
                    value="${studentItem.surname}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter student email</label>
                    <input
                    id="emailUpdate"
                    value="${studentItem.email}"
                    type="email"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter student image</label>
                    <input
                    id="imageUpdate"
                    value="${studentItem.image}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>
                <div class="form-group">
                    <label for="">Enter student university</label>
                    <input
                    id="universityNameUpdate"
                    value="${studentItem.unievrsityName}"
                    type="text"
                    placeholder="Enter here"
                    class="form-control"
                    />
                </div>`
    }

    renderStudentsDataOnView(studentData) {
        var studentsArea = document.querySelector(".students-area");
        studentsArea.innerHTML = "";
        studentData.forEach(item => {
            studentsArea.innerHTML += this.getStudentCardHtml(item);
        });
    }


    clearInputs() {
        var allInputs = document.querySelectorAll(".form-control");
        allInputs.forEach(inpItem => {
            inpItem.value = "";
        })
    }

    saveStudentData() {
        var self = this;
        const nameInp = document.querySelector("#name");
        const surnameInp = document.querySelector("#surname");
        const emailInp = document.querySelector("#email");
        const imageInp = document.querySelector("#image");
        const universityNameInp = document.querySelector("#universityName");
        const saveStudentBtn = document.querySelector("#save");

        saveStudentBtn.addEventListener("click", function () {
            var student = new Student(
                nameInp.value,
                surnameInp.value,
                emailInp.value,
                imageInp.value,
                universityNameInp.value
            );

            self.apiWorker.createStudent(student, function (response) {
                if (response) {
                    self.showSuccessAlert();
                    self.initData();
                    self.clearInputs();
                }
            });
        })
    }

    updateStudent(studentId) {
        var self = this;
        self.apiWorker.getStudentById(studentId, function (response) {
            var modalBody = document.querySelector(".modal-body");
            var htmlForm = self.getStudentUpdateFormHtml(response);
            modalBody.innerHTML = htmlForm;
            const nameInp = document.querySelector("#nameUpdate");
            const surnameInp = document.querySelector("#surnameUpdate");
            const emailInp = document.querySelector("#emailUpdate");
            const imageInp = document.querySelector("#imageUpdate");
            const universityNameInp = document.querySelector("#universityNameUpdate");
            const updateStudentBtn = document.querySelector("#updateStudent");
            updateStudentBtn.addEventListener("click", function () {
                var student = new Student(
                    nameInp.value,
                    surnameInp.value,
                    emailInp.value,
                    imageInp.value,
                    universityNameInp.value,
                );
                student.id = studentId;

                self.apiWorker.updateStudentInformation(studentId, student, function (response) {
                    if (response) {
                        document.querySelector("#closeModal").click();
                        self.showSuccessAlert();
                        self.initData();
                        self.clearInputs();
                    }
                })
            });
        });

    }

    deleteStudent(elem, studentId) {
        var self = this;
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                self.apiWorker.deleteStudent(studentId, function (response) {
                    if (response) {
                        swal("Poof! Your imaginary file has been deleted!", {
                            icon: "success",
                        });
                        document.querySelector(".students-area").removeChild(elem.parentNode);
                    }
                })
            } else {
                swal("Your imaginary file is safe!");
            }
        });
    }


    showSuccessAlert() {
        swal("Good job!", "Success", "success");

    }
}



var viewWorker = new HtmlWorker(new ApiWorker());

