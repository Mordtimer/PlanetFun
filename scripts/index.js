function openForm() {
  document.getElementById("add-planetary-system-form").style.display = "block";
  document.getElementById("add-planetary-system-card").style.display = "none";
}

function closeForm() {
  document.getElementById("add-planetary-system-form").style.display = "none";
  document.getElementById("add-planetary-system-card").style.display = "flex";
}

window.addEventListener("load", () => {
  let planetarySystemId = 3;
  let url = `server/getplanets.php?planetary_system_id=${planetarySystemId}`;

  fetch(url).then((data) => {
    data.text().then((text) => {
      console.log(text);
    });
  });
});
