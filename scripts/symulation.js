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
    }

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
        case 1:
            viewport.DragViewport(event)
            UpdateCanvas()
            break
        default:
            return
    }
}

function MouseClick(event) {
    clicked = selectedObject(event)
    //console.log(clicked)
    if (clicked != null) {
        openMenu(clicked)
    } else {
        closeMenu()
    }
    UpdateCanvas()
}

function MouseWheel(event) {
    viewport.ZoomViewport(event)
    UpdateCanvas()
}

function UpdateModel(SUN, model) {
    drawableElements.forEach(e => {
        e.Update(SUN, model)
    })
}

function UpdateCanvas() {
    var context = canvas.getContext("2d")
    var contextTransform = context.getTransform()

    context.clearRect(0, 0, canvas.width / contextTransform.a, canvas.height / contextTransform.d)

    SUN.Draw(viewport);
    drawableElements.forEach(e => {
        e.Draw(viewport)
    })
}


function mainLoop() {
    UpdateModel(SUN, dtx);
    UpdateCanvas();
    requestAnimationFrame(mainLoop);
}

const dtx = 0.16;
const gravitConst = 1000;
let viewport = new Viewport()
let drawableElements = []
var SUN = new Planet(new Vector2D(500, 500), new Vector2D(100, 100), new Vector2D(0, 0), 1000, 50, "#ffff00", dtx, gravitConst)


drawableElements.push(new Planet(new Vector2D(700, 50), new Vector2D(10, 50), new Vector2D(0, 0), 10, 13, "#ff0000", gravitConst))
    //Tu się dzieją ciekawe rzeczy
drawableElements.push(new Planet(new Vector2D(1000, 500), new Vector2D(10, 1), new Vector2D(0, 0), 10, 13, "#66ff99", gravitConst))
drawableElements.push(new Planet(new Vector2D(1000, 1000), new Vector2D(-30, 30), new Vector2D(0, 0), 10, 13, "#0033cc", gravitConst))

canvas.addEventListener("click", MouseClick, true)
canvas.addEventListener("mousemove", MouseMove)
canvas.addEventListener("wheel", MouseWheel)
canvas.addEventListener('contextmenu', event => event.preventDefault());
requestAnimationFrame(mainLoop);