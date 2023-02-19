let alumniYears = {
    "Nov 2022": "2022-11-01",
    "Dec 2022": "2022-12-01"
};

window.onload = () => {
    fillCourseDates()
    searchToggler()
    dataInit("http://127.0.0.1:8000/api/students")
}

function fillCourseDates() {
    const whatCourse = document.querySelector("#whatCourse")
    for (const [key, value] of Object.entries(alumniYears)) {
        const option = document.createElement("option")
        option.setAttribute("value", value)
        option.innerText = `${key}`
        whatCourse.append(option)
    }
}

function searchToggler() {

    const fullNameSearchInput = document.querySelector('[data-name-search="full"]')
    const partialNameSearchInputs = document.querySelectorAll('[data-name-search="partial"]')

    // Check if fullname field is empty, disable partial name inputs:
    fullNameSearchInput.addEventListener("input", () => {
        if (fullNameSearchInput.value === '') {
            partialNameSearchInputs.forEach((field) => {
                field.removeAttribute('disabled')
            })
        } else {
            partialNameSearchInputs.forEach((field) => {
                field.setAttribute('disabled', true)
            })
        }
    })

    // Check if both partial name values are empty, disable fullname field:
    const isEmpty = (element) => element.value === '';

    partialNameSearchInputs.forEach((input) => {
        input.addEventListener("input", () => {
            fullNameSearchInput.disabled = !(Array.from(partialNameSearchInputs).every(isEmpty))
        })
    })
}

function formSubmitHandler(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const formDataArray = Array.from(formData)
    const formDataValid = formDataArray.filter((pair) => pair[1] !== '' && pair[1] !== 'default')

    let apiURL = "http://127.0.0.1:8000/api/students?"
    const queryParams = new URLSearchParams(formDataValid)
    if (queryParams) {
        apiURL += queryParams
    }

    // Disable form fields while request is in the works:
    event.target.querySelectorAll('input, button, select').forEach((field) => {
        field.setAttribute('disabled', true)
    })
    fetch(`${apiURL}`)
        .then((response) => {
            const alert = document.querySelector("#searchAlert")
            if (response.status !== 200) {
                alert.classList.toggle("d-none")
            } else {
                if (!alert.classList.contains("d-none")) {
                    alert.classList.toggle("d-none")
                }
                return response.json()
                    .then(() => {
                        const studentsContainer = document.querySelector("#studentsContainer")
                        studentsContainer.innerHTML = ""
                        // dataInit takes in a URL to perform a fetch, however the fetch is already performed,
                        // perhaps a better way is to create a diff func for this part - parses Objects to the DOM?
                        dataInit(apiURL)
                        event.target.querySelectorAll('input, button, select').forEach((field) => {
                            field.removeAttribute('disabled')
                        })
                    })
            }
        })
        .catch((error) => {
            console.error('Error:', error)
        })
        .finally(() => {
            // Enable form fields and reset the form:
            event.target.querySelectorAll('input, button, select').forEach((field) => {
                field.removeAttribute('disabled')
            })
            event.target.reset()
        })
}

// dataInit() populates the DOM with all the students & relevant data, hence 'init'
function dataInit(apiURL) {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            const studentsContainer = document.querySelector("#studentsContainer")
            for (const [index, studentObj] of data.entries()) {
                if (index === 0 || index % 3 === 0) {
                    const newRow = document.createElement("div")
                    newRow.setAttribute("class", "row justify-content-center mb-5")
                    newRow.append(generateStudent(studentObj))
                    studentsContainer.append(newRow)
                } else {
                    rows = document.querySelectorAll("#studentsContainer .row")
                    const lastRow = rows[rows.length - 1]
                    lastRow.append(generateStudent(studentObj))
                }
            }
        })
}

// Create a student card
function generateStudent(studentObj) {
    const newCol = document.createElement("div")
    newCol.classList.add("col-3")
    const newCard = document.createElement("div")
    newCard.classList.add("card")
    const newCardImage = document.createElement("img")
    newCardImage.classList.add("card-img-top")
    newCardImage.setAttribute("src", studentObj.profile_pic)
    newCardImage.setAttribute("alt", `${studentObj.fullname}'s profile picture`)
    const newCardBody = document.createElement("div")
    newCardBody.classList.add("card-body")
    const newStudentName = document.createElement("h5")
    newStudentName.classList.add("card-title")
    newStudentName.innerText = studentObj.fullname
    const newStudentPronoun = document.createElement("h6")
    newStudentPronoun.setAttribute("class", "card-subtitle mb-2 text-muted")
    if (studentObj.gender === "Male") {
        newStudentPronoun.innerText = 'he/him'
    } else {
        newStudentPronoun.innerText = 'she/her'
    }
    const newEnrollmentDate = document.createElement("p")
    newEnrollmentDate.classList.add("card-text")
    newEnrollmentDate.innerText = Object.keys(alumniYears).find(key => alumniYears[key] === studentObj.enrollment_date)
    // Create student card body
    newCardBody.append(newStudentName)
    newCardBody.append(newStudentPronoun)
    newCardBody.append(newEnrollmentDate)
    // Create student card (composed of body & image)
    newCard.append(newCardImage)
    newCard.append(newCardBody)
    // Create a student column
    newCol.append(newCard)
    return newCol
}