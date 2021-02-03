var selected = null;
document.getElementById("mInc").addEventListener("click", increaseMass)
document.getElementById("mDec").addEventListener("click", decreaseMass)
document.getElementById("rInc").addEventListener("click", increaseRadius)
document.getElementById("rDec").addEventListener("click", decreaseRadius)


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
    //console.log(mousePos, el)
    if(mousePos.x >= el.position.x-el.radius-60 && mousePos.x <= el.position.x+el.radius+60 && mousePos.y >= el.position.y-el.radius-60 && mousePos.y <= el.position.y+el.radius+60){
        return true
    }
    else {
        return false
    }
}

function openMenu(selectedOb) {
    selected = selectedOb;
    document.getElementById('menu').style.display="inline";
    
}

function closeMenu(){
    document.getElementById('menu').style.display="none";
}

function increaseMass(){
    selected.mass += 10
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function decreaseMass(){
    selected.mass -= 10
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function increaseRadius(){
    selected.radius += 10
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}

function decreaseRadius(){
    selected.radius -= 10
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
}