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
    if(mousePos.x >= el.x-el.r && mousePos.x <= el.x+el.r && mousePos.y >= el.y-el.r && mousePos.y <= el.y+el.r){
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
    //todo0
}

function decreaseMass(){
    //todo
}

function increaseRadius(){
    selected.r += 10
    console.log(selected)
    UpdateCanvas()
}

function decreaseRadius(){
    selected.r -= 10
    console.log(selected)
    UpdateCanvas()
}