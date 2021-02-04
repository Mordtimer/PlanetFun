var dropImg = document.getElementById("dropimg");

var isClickedDropImg = false;

dropImg.addEventListener("click", () => {
  document.getElementById("dropdown-content-id").classList.toggle("show-dropdown");
  if (isClickedDropImg) {
    dropImg.style.transform = "";
  } else {
    dropImg.style.transform = "rotate(180deg)";
  }
  isClickedDropImg = !isClickedDropImg;
});
