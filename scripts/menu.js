var selected = null;
document.getElementById("mInc").addEventListener("click", increaseMass)
document.getElementById("mDec").addEventListener("click", decreaseMass)
document.getElementById("rInc").addEventListener("click", increaseRadius)
document.getElementById("rDec").addEventListener("click", decreaseRadius)


function selectedObject(event) {
    mousePos = viewport.GetMousePosition(event)
    mousePos.x -= viewport.x;
    mousePos.y -=viewport.y;
    for(el of drawableElements){
        if(isClicked(mousePos, el)){
            return el
        }
    }
    return null
}

function isClicked(mousePos, el) {
    //console.log(mousePos, el)
    if(mousePos.x >= el.position.x-el.radius && mousePos.x <= el.position.x+el.radius && mousePos.y >= el.position.y-el.radius && mousePos.y <= el.position.y+el.radius){
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