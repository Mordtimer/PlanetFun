class Viewport {
    constructor() {
        this.x = 0
        this.y = 0
        this.zoom = 1
    }

    GetMousePosition(event) {
        var contextTransform =  canvas.getContext("2d").getTransform()
        return {
            x: event.offsetX / contextTransform.a - this.x,
            y: event.offsetY / contextTransform.d - this.y
        }
    }

    DragViewport(event) {
        var contextTransform =  canvas.getContext("2d").getTransform()
        this.x += event.movementX / contextTransform.a
        this.y += event.movementY / contextTransform.d
    }

    ZoomViewport(event) {
        var context = canvas.getContext("2d")

        var mouseStart = viewport.GetMousePosition(event)
    
        if(event.deltaY > 0) {
            context.scale(0.5, 0.5)
            viewport.zoom *= 0.5
        }
        else {
            context.scale(2, 2)
            viewport.zoom *= 2
        }
    
        var mouseEnd = viewport.GetMousePosition(event)
    
        viewport.x += mouseEnd.x - mouseStart.x
        viewport.y += mouseEnd.y - mouseStart.y
    
    }
}

class Object {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.r = r
        this.color = "#fff"
    }

    Draw(viewport) {
        var context = canvas.getContext("2d")

        context.beginPath()
        context.arc(
            this.x + viewport.x,
            this.y + viewport.y,
            this.r,
            0,
            2*Math.PI
        )
        context.fillStyle = this.color
        context.fill()
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

var viewport = new Viewport()
var drawableElements = []

drawableElements.push(new Object(100,100,20))

canvas.addEventListener("mousemove", MouseMove)
canvas.addEventListener("wheel", MouseWheel)
canvas.addEventListener('contextmenu', event => event.preventDefault());

function MouseMove(event) {
    switch(event.which) {
        case 1:
            viewport.DragViewport(event)
            UpdateCanvas()
            break
        default:
            return
    }
}

function MouseWheel(event) {
    viewport.ZoomViewport(event)
    UpdateCanvas()
}

function UpdateCanvas() {
    var context = canvas.getContext("2d")
    var contextTransform =  context.getTransform()

    context.clearRect(0, 0, canvas.width/contextTransform.a, canvas.height/contextTransform.d)

    drawableElements.forEach( e => {
        e.Draw(viewport)
    })
}