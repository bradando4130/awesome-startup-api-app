/* Global initialised variables */
let employeesData = [];
const gallerySection = document.querySelector("#gallery");
let modalIndex;

// URL oof Random User Generator API
const urlAPI = `https://randomuser.me/api/?results=12&inc=name,picture,email,location,phone,dob&noinfo&nat=US`;

/**
 * Fetch function to make API call to collect data of employees
 * fetch data =>
 * parse data to JSON =>
 * access results of return promise object =>
 * display employees to screen =>
 * catch error (if applicable)
 */
fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then((data) => (employeesData = data))
  .then((data) => displayEmployees(data))
  .catch((err) => console.log(err));

/**
 * Create html for each employee data object and append to page
 * in individual divs in a grid format
 * @param {Array} employeeData returned array of employees from API call
 */
const displayEmployees = (employeeData) => {
  employeeData.forEach((employee, index) => {
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
 * @param {number} index index of employee that has been clicked on from original results array
 */

const createModal = (index) => {
  // destructure to allocate variables
  const { dob, email, location, name, phone, picture } = employeesData[index];
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
 * achieved via toggling through modalIndex values
 */
const toggleLeft = () => {
  if (modalIndex === 0) {
    modalIndex = 11;
    createModal(modalIndex);
  } else {
    createModal((modalIndex -= 1));
  }
};

const toggleRight = () => {
  if (modalIndex === 11) {
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
