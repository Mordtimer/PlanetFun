class Viewport {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
    }

    GetMousePosition(event) {
        var contextTransform = canvas.getContext("2d").getTransform();
        return {
            x: event.offsetX / contextTransform.a - this.x,
            y: event.offsetY / contextTransform.d - this.y,
        };
    }

    DragViewport(event) {
        var contextTransform = canvas.getContext("2d").getTransform();
        this.x += event.movementX / contextTransform.a;
        this.y += event.movementY / contextTransform.d;
    }

    ZoomViewport(event) {
        var context = canvas.getContext("2d");

        var mouseStart = viewport.GetMousePosition(event);

        if (event.deltaY > 0) {
            context.scale(0.5, 0.5);
            viewport.zoom *= 0.5;
        } else {
            context.scale(2, 2);
            viewport.zoom *= 2;
        }

        var mouseEnd = viewport.GetMousePosition(event);

        viewport.x += mouseEnd.x - mouseStart.x;
        viewport.y += mouseEnd.y - mouseStart.y;
    }
}

class Planet {
    constructor(id, position, velocity, distance, mass, radius, color, gravConst) {
        this.id = id;
        this.position = position;
        this.velocity = velocity;
        this.distance = distance;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
        this.gravConst = gravConst;
    }

    Draw(viewport) {
        var context = canvas.getContext("2d");

        context.beginPath();
        context.arc(
            this.position.x + viewport.x,
            this.position.y + viewport.y,
            this.radius,
            0,
            2 * Math.PI
        );
        context.fillStyle = this.color;
        context.fill();
    }

    Update2(planets, dt) {
            let myVector = new Vector2D(0, 0);

            planets.forEach((planet) => {
                if (planet != this) {
                    this.position.x = this.position.x + this.velocity.x * dt;

                    this.position.y += this.velocity.y * dt;
                    let dist = new Vector2D(
                        planet.position.x - this.position.x,
                        planet.position.y - this.position.y
                    );
                    let tmpDist = this.position.distanceTo(planet.position);

                    let distNormalized = dist.normalize();
                    this.velocity.x =
                        this.velocity.x + this.gravConst * (planet.mass / tmpDist) * distNormalized.x * dt;
                    this.velocity.y =
                        this.velocity.y + this.gravConst * (planet.mass / tmpDist) * distNormalized.y * dt;
                }
            });
            let len = drawableElements.length;
            for (let index = 0; index < len; index++) {
                if (drawableElements[index].position.distanceTo(this.position) < (drawableElements[index].radius + this.radius) &&
                    drawableElements.indexOf(this) != index

                ) {
                    console.log("BUM")
                    if (this.mass > drawableElements[index].mass) {
                        this.mass += drawableElements[index].mass;
                        this.radius += drawableElements[index].radius * (drawableElements[index].mass / this.mass);
                        drawableElements.splice(index, 1);
                    } else if (this.mass <= drawableElements[index].mass) {
                        drawableElements[index].mass += this.mass;
                        drawableElements[index].radius += this.radius * (this.mass / drawableElements[index].mass);
                        let tmpIndex = drawableElements.indexOf(this);
                        drawableElements.splice(tmpIndex, 1);

                    }
                    len -= 1;
                }
            }
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
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    UpdateCanvas();
});

window.addEventListener("resize", () => {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    canvas.getContext("2d").scale(viewport.zoom, viewport.zoom);

    UpdateCanvas();
});

function MouseMove(event) {
    switch (event.which) {
        case 1:
            viewport.DragViewport(event);
            UpdateCanvas();
            break;
        default:
            return;
    }
}

function MouseClick(event) {
    clicked = selectedObject(event);
    //console.log(clicked)
    if (clicked != null) {
        closeMenu();
        openMenu(clicked);
    } else {
        closeMenu();
    }
    UpdateCanvas();
}

function MouseWheel(event) {
    viewport.ZoomViewport(event);
    UpdateCanvas();
}

var previousTouch;
canvas.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    var contextTransform = canvas.getContext("2d").getTransform()
    if (previousTouch) {
        e.movementX = touch.pageX - previousTouch.pageX;
        e.movementY = touch.pageY - previousTouch.pageY;
        viewport.x += e.movementX / contextTransform.a
        viewport.y += e.movementY / contextTransform.d
    };

    previousTouch = touch;
});

canvas.addEventListener("touchend", (e) => {
    previousTouch = null;
});

/*
function UpdateModel(SUN, model) {
    drawableElements.forEach(e => {
        e.Update(SUN, model)
    })
}*/

function UpdateModel2(list, model) {
    drawableElements.forEach((e) => {
        e.Update2(list, model);
    });
}

function UpdateCanvas() {
    var context = canvas.getContext("2d");
    var contextTransform = context.getTransform();

    context.clearRect(0, 0, canvas.width / contextTransform.a, canvas.height / contextTransform.d);
    drawableElements.forEach((e) => {
        e.Draw(viewport);
    });
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
let viewport = new Viewport();
let drawableElements = [];

canvas.addEventListener("click", MouseClick, true);
canvas.addEventListener("mousemove", MouseMove);
canvas.addEventListener("wheel", MouseWheel);
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
requestAnimationFrame(mainLoop);