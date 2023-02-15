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
    for (const pair of formData.entries()) {
        console.log(pair)
    }
}