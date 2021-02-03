const dropImg = document.getElementById("dropimg");

const addPlanetarySystemForm = document.forms[0];
const addPlanetarySystemBtn = document.getElementById("add-planetary-system-btn");
const addPlanetarySystemItem = document.getElementsByClassName("add-planetary-system-item")[0];

const planetarySystemItems = document.getElementsByClassName("dropdown-item");

const dropdownContent = document.getElementById("dropdown-content-id");

const canvas = document.getElementById("canvas");

var isClickedDropImg = false;

var currentPlanetarySystemId = -1;

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
  fetch("server/getPlanetarySystems.php")
    .then((response) => response.json())
    .then((data) => {
      for (let planetarySystem of data) {
        addNewPlanetarySystemHTML(planetarySystem.id, planetarySystem.name);
      }
      if (data.length > 0) {
        var currentPlanetarySystemId = data[data.length - 1].id;

        let formData = new FormData();
        formData.append("planetary_system_id", currentPlanetarySystemId.toString());

        fetch("server/getPlanets.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            for (let planet in data) {
              // TODO init planets
            }
          });
      } else {
        let formData = new FormData();
        formData.append("name", "default");
        postPlanetarySystem(formData).then((data) => {
          currentPlanetarySystemId = data.id;
          addNewPlanetarySystemHTML(data.id, data.name);
        });
      }
      selectCurrentPlanetarySystem(currentPlanetarySystemId);
    });
});

function selectCurrentPlanetarySystem(id) {
  let previousId = currentPlanetarySystemId;
  if (previousId > 0) {
    let previousItem = Array.from(planetarySystemItems).find(
      (element) => element.dataset.id === previousId
    );
    previousItem.classList.toggle("selected-planet-system");
  }

  let currentItem = Array.from(planetarySystemItems).find((element) => element.dataset.id === id);
  currentItem.classList.toggle("selected-planet-system");

  currentPlanetarySystemId = id;
}

// Add new planets system form
addPlanetarySystemBtn.addEventListener("click", () => {
  if (addPlanetarySystemForm.reportValidity()) {
    let formData = new FormData(addPlanetarySystemForm);
    postPlanetarySystem(formData).then((data) => addNewPlanetarySystemHTML(data.id, data.name));
  }
});

function addNewPlanetarySystemHTML(id, name) {
  let item = `<div data-id="${id}" class="dropdown-item">
                <img class="planetary-system-img" src="images/solar-system.svg" />
                <a>${name}</a>
                <img class="delete-planetary-system-img" src="images/delete.svg" />
              </div>`;
  addPlanetarySystemItem.insertAdjacentHTML("afterend", item);
}

var postPlanetarySystem = (formData) =>
  fetch("server/postPlanetarySystem.php", {
    method: "POST",
    body: formData,
  }).then((response) => response.json());

// Dropdown item on click
dropdownContent.addEventListener("click", (e) => {
  let element = e.target;

  // Delete planets system on click
  if (element.classList.contains("delete-planetary-system-img")) {
    let div = element.parentNode;
    let id = div.dataset.id;

    let formData = new FormData();
    formData.append("planetary_system_id", id.toString());

    fetch("server/deletePlanetarySystem.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then(() => div.remove());
  } else if (element.classList.contains("dropdown-item")) {
    selectCurrentPlanetarySystem(element.dataset.id);
  } else if (element.classList.contains("planetary-system-img") || element.tagName === "A") {
    selectCurrentPlanetarySystem(element.parentNode.dataset.id);
  }
});
