const dropImg = document.getElementById("dropimg");
const addPlanetarySystemForm = document.forms[0];
const addPlanetarySystemBtn = document.getElementById("add-planetary-system-btn");
const addPlanetarySystemItem = document.getElementsByClassName("add-planetary-system-item")[0];

const dropdownContent = document.getElementById("dropdown-content-id");

var isClickedDropImg = false;

// Animate arrow on click
dropImg.addEventListener("click", () => {
  document.getElementById("dropdown-content-id").classList.toggle("show-dropdown");
  if (isClickedDropImg) {
    dropImg.style.transform = "";
  } else {
    dropImg.style.transform = "rotate(180deg)";
  }
  isClickedDropImg = !isClickedDropImg;
});

// fetch planets systems and update content of dropdown list
window.addEventListener("load", () => {
  fetch("server/getPlanetsSystems.php")
    .then((response) => response.json())
    .then((data) => {
      for (let planetsSystem of data) {
        addNewPlanetarySystem(planetsSystem.id, planetsSystem.name);
      }
    });
});

// Add new planets System form
addPlanetarySystemBtn.addEventListener("click", () => {
  if (addPlanetarySystemForm.reportValidity()) {
    let formData = new FormData(addPlanetarySystemForm);
    fetch("server/postPlanetsSystem.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        addNewPlanetarySystem(data.id, data.name);
      });
  }
});

function addNewPlanetarySystem(id, name) {
  let item = `<div data-id="${id}" class="dropdown-item">
                <img class="planetary-system-img" src="images/solar-system.svg" />
                <a>${name}</a>
                <img class="delete-planetary-system-img" src="images/delete.svg" />
              </div>`;
  addPlanetarySystemItem.insertAdjacentHTML("afterend", item);
}

// Delete planets System on click
dropdownContent.addEventListener("click", (e) => {
  let element = e.target;

  if (element.classList.contains("delete-planetary-system-img")) {
    let div = element.parentNode;
    let id = div.dataset.id;

    let formData = new FormData();
    formData.append("planetary_system_id", id.toString());

    fetch("server/deletePlanetsSystem.php", {
      method: "POST",
      body: formData,
    }).then(() => div.remove());
  }
});
