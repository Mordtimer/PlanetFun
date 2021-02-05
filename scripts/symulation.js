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
      if (
        drawableElements[index].position.distanceTo(this.position) <
          drawableElements[index].radius + this.radius &&
        drawableElements.indexOf(this) != index
      ) {
        if (this.mass > drawableElements[index].mass) {
          this.mass += drawableElements[index].mass;
          this.radius +=
            drawableElements[index].radius * (drawableElements[index].mass / this.mass);

          let deletedElement = drawableElements.splice(index, 1)[0];

          let formDataDelete = new FormData();
          formDataDelete.append("planet_id", deletedElement.id);
          fetch("server/deletePlanet.php", {
            method: "POST",
            body: formDataDelete,
          });
        } else if (this.mass <= drawableElements[index].mass) {
          drawableElements[index].mass += this.mass;
          drawableElements[index].radius +=
            this.radius * (this.mass / drawableElements[index].mass);

          let tmpIndex = drawableElements.indexOf(this);
          let deletedElement = drawableElements.splice(tmpIndex, 1)[0];

          let formDataDelete = new FormData();
          formDataDelete.append("planet_id", deletedElement.id);
          fetch("server/deletePlanet.php", {
            method: "POST",
            body: formDataDelete,
          });
        }
        len -= 1;

        let formDataUpdate = new FormData();
        formDataUpdate.append("planet_id", this.id.toString());
        formDataUpdate.append("color", this.color);
        formDataUpdate.append("mass", this.mass.toString());
        formDataUpdate.append("radius", this.radius.toString());
        fetch("server/updatePlanet.php", {
          method: "POST",
          body: formDataUpdate,
        });
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
    case 3:
      viewport.DragViewport(event);
      UpdateCanvas();
      break;
    case 1:
      mousePosition = viewport.GetMousePosition(event);
      break;
    default:
      return;
  }
}

function MouseDown(event) {
  switch (event.which) {
    case 1:
      clicked = selectedObject(event);
      if (clicked != null) {
        closeMenu();
        openMenu(clicked);
      } else {
        closeMenu();
        if (addPlanet.classList.contains("active")) {
          var pos = viewport.GetMousePosition(event);
          clickPosition = new Vector2D(pos.x, pos.y);
          mousePosition = pos;
        }
      }
      break;
  }
}

function MouseUp(event) {
  switch (event.which) {
    case 1:
      if (clickPosition != null) {
        var pos = viewport.GetMousePosition(event);
        var velocity = new Vector2D(
          (clickPosition.x - pos.x) / 200,
          (clickPosition.y - pos.y) / 200
        );

        let formData = new FormData();
        formData.append("planetary_system_id", canvas.dataset.id);
        formData.append("position_x", pos.x.toString());
        formData.append("position_y", pos.y.toString());
        formData.append("velocity_x", velocity.x.toString());
        formData.append("velocity_y", velocity.y.toString());
        formData.append("mass", planetMass.value.toString());
        formData.append("radius", planetRadius.value.toString());
        formData.append("color", planetColor.value.toString());
        formData.append("gravity_const", gravitConst.toString());

        fetch("server/postPlanet.php", {
          method: "post",
          body: formData,
        })
          .then((response) => response.json())
          .then((planet) => {
            drawableElements.push(
              new Planet(
                planet.id,
                new Vector2D(planet.position_x, planet.position_y),
                new Vector2D(planet.velocity_x, planet.velocity_y),
                new Vector2D(0, 0),
                planet.mass,
                planet.radius,
                planet.color,
                planet.gravity_const
              )
            );
          });

        clickPosition = null;
        mousePosition = null;
      }
      break;
  }
}

function MouseWheel(event) {
  viewport.ZoomViewport(event);
  UpdateCanvas();
}

var previousTouch;
canvas.addEventListener("touchmove", (e) => {
  const touch = e.touches[0];
  var contextTransform = canvas.getContext("2d").getTransform();
  if (previousTouch) {
    e.movementX = touch.pageX - previousTouch.pageX;
    e.movementY = touch.pageY - previousTouch.pageY;
    viewport.x += e.movementX / contextTransform.a;
    viewport.y += e.movementY / contextTransform.d;
  }

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

  if (clickPosition != null) {
    context.lineWidth = 1 / viewport.zoom;

    context.strokeStyle = "#ff0000";
    context.beginPath();
    context.moveTo(clickPosition.x + viewport.x, clickPosition.y + viewport.y);
    context.lineTo(mousePosition.x + viewport.x, mousePosition.y + viewport.y);
    context.stroke();

    context.strokeStyle = "#ffffff";
    context.beginPath();
    context.moveTo(clickPosition.x + viewport.x, clickPosition.y + viewport.y);
    context.lineTo(
      2 * clickPosition.x - mousePosition.x + viewport.x,
      2 * clickPosition.y - mousePosition.y + viewport.y
    );
    context.stroke();
  }
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
let clickPosition = null;
let mousePosition = null;

canvas.addEventListener("mouseup", MouseUp, true);
canvas.addEventListener("mousedown", MouseDown, true);
canvas.addEventListener("mousemove", MouseMove);
canvas.addEventListener("wheel", MouseWheel);
canvas.addEventListener("contextmenu", (event) => event.preventDefault());

requestAnimationFrame(mainLoop);
