planetParamsClose.addEventListener("click", () => {
    planetParamsContent.classList.toggle("show")
    if(planetParamsContent.classList.contains("show")) {
        planetParamsCloseButton.style.transform = "rotate(180deg)"
    }
    else{
        planetParamsCloseButton.style.transform = ""
    }
})

addPlanet.addEventListener("click", () => {
    addPlanet.classList.toggle("active")
})