/* Global initialised variables */
let employeesData = []; // variable to hold returned API results
let currentEmployees = []; // variable to hold filtered employees currently displayed on screen
const gallerySection = document.querySelector("#gallery");
let modalIndex;

// URL oof Random User Generator API
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;

/**
 * Fetch function to make API call to collect data of employees
 * fetch data =>
 * parse data to JSON =>
 * access results of return promise object =>
 * store these results in employeesData =>
 * display employees to screen =>
 * catch error (if applicable)
 */
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then((data) => (employeesData = data)) 
  .then((employeesData) => displayEmployees(employeesData))
  .catch((err) => console.log(err));

/**
 * Create html for each employee data object and append to page
 * in individual divs in a grid format
 * @param {Array} array array of employees
 */
const displayEmployees = (arr) => {
  // if currentEmployees is empty, initialise with employeesData
  currentEmployees.length === 0 ? currentEmployees = employeesData : '';

  gallerySection.innerHTML = "";
  arr.forEach((employee, index) => {
    gallerySection.insertAdjacentHTML(
      "beforeend",
      `
        <div class="card" data-index=${index}>
            <div class="card-img-container">
                <img class="card-img" src="${employee.picture.medium}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                <p class="card-text">${employee.email}</p>
                <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
            </div>
        </div>
    `
    );
  });
};

// call displayEmployees() with returned API results
displayEmployees(employeesData);

/**
 * When user clicks on employee, first checks if click is on employee .card container
 * fires createModal() to build modal overlay with that employee's data
 * initialise modalIndex variable with clicked modals index for reference later
 * @param {object} e event object of click
 */
gallerySection.addEventListener("click", (e) => {
  // first check if e.target is not gridContainer itself
  if (e.target !== gallerySection) {
    // select closest .card elemenet
    const card = e.target.closest(".card");
    const index = card.getAttribute("data-index");

    modalIndex = parseInt(index);
    // run create modal with index of .card
    createModal(modalIndex);
  }
});

/**
 * Display a modal overlay for an employee on click for more detailed information
 * @param {number} index index of employee that has been clicked on from current employees on screen
 */

const createModal = (index) => {
  // destructure to allocate variables, if currentEmployees is undefined, use employeesData. prefer currentEmployees
  const { dob, email, location, name, phone, picture } =
    currentEmployees.length === 0
      ? employeesData[index]
      : currentEmployees[index];
  const date = new Date(dob.date);

  modalInfo.innerHTML = "";
  const modalHTML = `
                <img class="modal-img" src="${
                  picture.large
                }" alt="profile picture">
                <h3 id="name" class="modal-name cap">${name.title} ${
    name.first
  } ${name.last}</h3>
                <p class="modal-text">${email}</p>
                <p class="modal-text cap">${location.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${location.street.number} ${
    location.street.name
  }, ${location.city}, ${location.state} ${location.postcode}</p>
                <p class="modal-text">Birthday: ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}</p>
  `;
  modalInfo.insertAdjacentHTML("beforeend", modalHTML);
  modalDiv.classList.remove("hidden");
};

// modal variables
const modalDiv = document.querySelector(".modal-container");
const modalInfo = document.querySelector(".modal-info-container");
const modalClose = document.querySelector(".modal-close-btn");
const modalBox = document.querySelector(".modal");
const modalBtnBox = document.querySelector(".modal-btn-container");
const modalPrev = document.querySelector(".modal-prev");
const modalNxt = document.querySelector(".modal-next");

/**
 * Toggle left and right between employees on the modal via interacting with modal buttons
 * achieved via toggling through modalIndex values of current employees
 */
const toggleLeft = () => {
  if (modalIndex === 0) {
    modalIndex = (currentEmployees.length - 1);
    createModal(modalIndex);
  } else {
    createModal((modalIndex -= 1));
  }
};

const toggleRight = () => {
  if (modalIndex >= (currentEmployees.length - 1)) {
    modalIndex = 0;
    createModal(modalIndex);
  } else {
    createModal((modalIndex += 1));
  }
};

/**
 * hide modal
 */
const hideModal = () => modalDiv.classList.add("hidden");

/**
 * toggle modal based on left and right click of modal buttons
 */
modalPrev.addEventListener("click", toggleLeft);
modalNxt.addEventListener("click", toggleRight);

/**
 * Keyboard functionality
 * Toggle left and right between employees with arrow keys
 * Close modal with Esc key
 * @param {object} e event object
 */
document.addEventListener("keydown", (e) => {
  // check if modal active first
  if (!modalDiv.classList.contains("hidden"))
    if (e.key === "ArrowLeft") {
      toggleLeft();
    } else if (e.key === "ArrowRight") {
      toggleRight();
    } else if (e.key === "Escape") {
      hideModal();
    }
});

/**
 * Close modal if clicking on x button
 */
modalClose.addEventListener("click", () => hideModal());

/**
 * Search bar function to filter employees displayed
 * crosscheck user input against name.first and name.last of each employee in employeeData array
 * if searchInput is included in first or last name of employee, include in new array
 * pass new array into displayEmployees()
 */

const searchInput = document.querySelector(".search-input");
const searchSubmit = document.querySelector(".search-submit");

const filterEmployees = () => {
  const searchInputValue = document
    .querySelector(".search-input")
    .value.toLowerCase();
  // normalise name to lower case
  const filteredEmployees = employeesData.filter((employee) => {
    const firstName = employee.name.first.toLowerCase();
    const lastName = employee.name.last.toLowerCase();
    return firstName.includes(searchInputValue) ||
      lastName.includes(searchInputValue)
      ? true
      : false;
  });
  // update variable to hold current employees on screen
  currentEmployees = filteredEmployees;

  // pass filtered employees to displayEmployees()
  displayEmployees(filteredEmployees);
};

// search input reset on page load
searchInput.value = "";

/**
 * Event listener for search input
 */
searchInput.addEventListener("input", filterEmployees);
