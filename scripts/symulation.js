class Viewport {
    constructor() {
        this.x = 0
        this.y = 0
        this.zoom = 1
    }


    GetMousePosition(event) {
        var contextTransform = canvas.getContext("2d").getTransform()
        return {
            x: event.offsetX / contextTransform.a - this.x,
            y: event.offsetY / contextTransform.d - this.y
        }
    }

    DragViewport(event) {
        var contextTransform = canvas.getContext("2d").getTransform()
        this.x += event.movementX / contextTransform.a
        this.y += event.movementY / contextTransform.d
    }

    ZoomViewport(event) {
        var context = canvas.getContext("2d")

        var mouseStart = viewport.GetMousePosition(event)

        if (event.deltaY > 0) {
            context.scale(0.5, 0.5)
            viewport.zoom *= 0.5
        } else {
            context.scale(2, 2)
            viewport.zoom *= 2
        }

        var mouseEnd = viewport.GetMousePosition(event)

        viewport.x += mouseEnd.x - mouseStart.x
        viewport.y += mouseEnd.y - mouseStart.y

    }
}

class Planet {
    constructor(position, velocity, distance, mass, radius, color, gravConst) {
        this.position = position;
        this.velocity = velocity;
        this.distance = distance;
        this.mass = mass;
        this.radius = radius;
        this.color = color
            //this.dt = dt;
        this.gravConst = gravConst
    }

    Draw(viewport) {
        var context = canvas.getContext("2d")

        context.beginPath()
        context.arc(

                this.position.x + viewport.x,
                this.position.y + viewport.y,
                this.radius,
                0,
                2 * Math.PI
            )
            // console.log("position:" + this.position.x + " viewport:" + viewport.x);
        context.fillStyle = this.color
        context.fill()
    }

    Update2(planets, dt) {
            let myVector = new Vector2D(0, 0);

            planets.forEach(planet => {
                if (planet != this) {
                    //console.log(SUN.position.x + " y: " + SUN.position.y + " dt: " +
                    //dt + "gravConst: " + this.gravConst)
                    //console.log("Position before:" + this.position.x + " velocity:" + this.velocity.x);
                    this.position.x = this.position.x + (this.velocity.x * dt); //parseFloat(this.position.x) + parseFloat(this.velocity.x * dt);
                    //console.log("Position after: " + this.position.x);


                    this.position.y += this.velocity.y * dt;
                    let dist = new Vector2D(
                        planet.position.x - this.position.x, planet.position.y - this.position.y)
                    let tmpDist = this.position.distanceTo(planet.position)

                    //let distFromOther = Math.pow(this.distance.length(), 2)
                    //console.log("Distance from sun:" + distFromSun)

                    let distNormalized = dist.normalize()
                        //console.log("tmp.x: " + tmp.x + " tmp.y: " + tmp.y)
                    this.velocity.x = this.velocity.x + (this.gravConst * (planet.mass / tmpDist) * distNormalized.x * dt);
                    this.velocity.y = this.velocity.y + (this.gravConst * (planet.mass / tmpDist) * distNormalized.y * dt);
                    //console.log("Velocity after stuff:" + this.velocity.x)
                }
            })

        }
        /*
            Update(SUN, dt) {
                //console.log(SUN.position.x + " y: " + SUN.position.y + " dt: " +
                //    dt + "gravConst: " + this.gravConst)
                //console.log("Position before:" + this.position.x + " velocity:" + this.velocity.x);
                this.position.x = this.position.x + (this.velocity.x * dt); //parseFloat(this.position.x) + parseFloat(this.velocity.x * dt);
                //console.log("Position after: " + this.position.x);
                this.position.y += this.velocity.y * dt;
                this.distance.x = SUN.position.x - this.position.x;
                this.distance.y = SUN.position.y - this.position.y;
                let distFromSun = Math.pow(this.distance.length(), 2)
                    //console.log("Distance from sun:" + distFromSun)

                let tmp = this.distance.normalize()
                    //console.log("tmp.x: " + tmp.x + " tmp.y: " + tmp.y)
                this.velocity.x = this.velocity.x + (this.gravConst * (SUN.mass / distFromSun) * tmp.x * dt);
                this.velocity.y = this.velocity.y + (this.gravConst * (SUN.mass / distFromSun) * tmp.y * dt);
                //console.log("Velocity after stuff:" + this.velocity.x)
            }*/

    Setup(position, velocity, distance, mass, radius, color) {
        this.position = position;
        this.velocity = velocity;
        this.distance = distance;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }


}

window.addEventListener("load", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    UpdateCanvas()
})

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    canvas.getContext("2d").scale(viewport.zoom, viewport.zoom)

    UpdateCanvas()
})

function MouseMove(event) {
    switch (event.which) {
        case 3:
            viewport.DragViewport(event)
            UpdateCanvas()
            break
        case 1:
            mousePosition = viewport.GetMousePosition(event)
            break
        default:
            return
    }
}

function MouseDown(event) {
    switch (event.which) {
        case 1:
            clicked = selectedObject(event)
            if (clicked != null) {
                closeMenu()
                openMenu(clicked)
            } else {
                closeMenu()
                var pos = viewport.GetMousePosition(event)
                clickPosition = new Vector2D(pos.x, pos.y)
                mousePosition = pos
            }
        break
    }
}

function MouseUp(event) {
    switch (event.which) {
        case 1:
            if(clickPosition != null) {
                var pos = viewport.GetMousePosition(event)
                var velocity = new Vector2D((clickPosition.x - pos.x)/200, (clickPosition.y - pos.y)/200)
                drawableElements.push(new Planet(
                    clickPosition, 
                    velocity,
                    new Vector2D(0, 0),
                    planetMass.value,
                    planetRadius.value,
                    planetColor.value,
                    gravitConst)
                )
                clickPosition = null
                mousePosition = null
            }
        break
    }
}

function MouseWheel(event) {
    viewport.ZoomViewport(event)
    UpdateCanvas()
}
/*
function UpdateModel(SUN, model) {
    drawableElements.forEach(e => {
        e.Update(SUN, model)
    })
}*/

function UpdateModel2(list, model) {
    drawableElements.forEach(e => {
        e.Update2(list, model)
    })
}

function UpdateCanvas() {
    var context = canvas.getContext("2d")
    var contextTransform = context.getTransform()

    context.clearRect(0, 0, canvas.width / contextTransform.a, canvas.height / contextTransform.d)
    drawableElements.forEach(e => {
            e.Draw(viewport)
        })

    if(clickPosition!= null) {
        context.lineWidth = 1/viewport.zoom

        context.strokeStyle = "#ff0000"
        context.beginPath();
        context.moveTo(clickPosition.x + viewport.x, clickPosition.y + viewport.y)
        context.lineTo(mousePosition.x + viewport.x, mousePosition.y +  viewport.y)
        context.stroke()

        context.strokeStyle = "#ffffff"
        context.beginPath();
        context.moveTo(clickPosition.x + viewport.x, clickPosition.y + viewport.y)
        context.lineTo(2*clickPosition.x-mousePosition.x + viewport.x, 2*clickPosition.y-mousePosition.y + viewport.y)
        context.stroke()
    }
        /*SUN.Draw(viewport);
        drawableElements.forEach(e => {
            e.Draw(viewport)
        })*/
}


function mainLoop() {
    UpdateModel2(drawableElements, dtx);
    UpdateCanvas();
    requestAnimationFrame(mainLoop);
}

const dtx = 0.16;
const gravitConst = 0.1;
let viewport = new Viewport()
let drawableElements = []
let clickPosition = null
let mousePosition = null

drawableElements.push(new Planet(new Vector2D(800, 800), new Vector2D(0, 0), new Vector2D(0, 0), 20000, 100, "#ffff00", gravitConst))

// male planetki 
drawableElements.push(new Planet(new Vector2D(1500, 1500), new Vector2D(-20, 20), new Vector2D(0, 0), 0.1, 15, "#f0fff0", gravitConst))
drawableElements.push(new Planet(new Vector2D(200, 200), new Vector2D(-20, 20), new Vector2D(0, 0), 0.3, 15, "#6600ff", gravitConst))
    //drawableElements.push(new Planet(new Vector2D(700, 1000), new Vector2D(10, 50), new Vector2D(0, 0), 10, 13, "#ff0000", gravitConst))

drawableElements.push(new Planet(new Vector2D(5000, 5500), new Vector2D(20, -20), new Vector2D(0, 0), 5, 40, "#66ff99", gravitConst))
drawableElements.push(new Planet(new Vector2D(1000, 1300), new Vector2D(-40, 0), new Vector2D(0, 0), 1500, 40, "#0033cc", gravitConst))

canvas.addEventListener("mouseup", MouseUp, true)
canvas.addEventListener("mousedown", MouseDown, true)
canvas.addEventListener("mousemove", MouseMove)
canvas.addEventListener("wheel", MouseWheel)
canvas.addEventListener('contextmenu', event => event.preventDefault());
requestAnimationFrame(mainLoop);