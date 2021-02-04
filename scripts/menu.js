var selected = null;
document.getElementById("mInc").addEventListener("click", increaseMass)
document.getElementById("mDec").addEventListener("click", decreaseMass)
document.getElementById("rInc").addEventListener("click", increaseRadius)
document.getElementById("rDec").addEventListener("click", decreaseRadius)
document.getElementById("deletePlanet").addEventListener("click", deletePlanet)
const colorInput = document.getElementById("colorInput")
colorInput.addEventListener("change", changeColor)


function selectedObject(event) {
    mousePos = viewport.GetMousePosition(event)
    for(el of drawableElements){
        if(isClicked(mousePos, el)){
            return el
        }
    }
    return null
}

function isClicked(mousePos, el) {
    let clickR = 200
    if(mousePos.x >= el.position.x-el.radius-clickR && mousePos.x <= el.position.x+el.radius+clickR && mousePos.y >= el.position.y-el.radius-clickR && mousePos.y <= el.position.y+el.radius+clickR){
        return true
    }
    else {
        return false
    }
}

function openMenu(selectedOb) {
    selected = selectedOb;
    document.getElementById('menu').style.display="inline";
    colorInput.value = selectedOb.color
    
}

function closeMenu(){
    document.getElementById('menu').style.display="none";
}

function increaseMass(){
    selected.mass *=1.2
}

function decreaseMass(){
    selected.mass *=0.85
}

function increaseRadius(){
    selected.radius *=1.2
}

function decreaseRadius(){
    selected.radius *= 0.8
}

function changeColor(event){
    selected.color = event.target.value
}

function deletePlanet(){
    for(var i = 0;i<drawableElements.length;i++){
        if(drawableElements[i] === selected){
            drawableElements.splice(i,1)
        }
    }
}