var selected = null;
document.getElementById("mInc").addEventListener("click", increaseMass)
document.getElementById("mDec").addEventListener("click", decreaseMass)
document.getElementById("rInc").addEventListener("click", increaseRadius)
document.getElementById("rDec").addEventListener("click", decreaseRadius)
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
    let clickR = 80
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
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function decreaseMass(){
    selected.mass *=0.85
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function increaseRadius(){
    selected.radius *=1.2
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function decreaseRadius(){
    selected.radius *= 0.8
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function changeColor(event){
    selected.color = event.target.value
}