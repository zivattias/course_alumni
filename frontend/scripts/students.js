let alumniYears = {
    "Nov 2022": "2022-11-01",
    "Dec 2022": "2022-12-01"
};

window.onload = () => {
    fillCourseDates()
    searchToggler()
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
            if (response.status !== 200) {
                console.log("No data matching search")
            } else {
                return response.json()
                    .then((data) => {
                        console.log(data)
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