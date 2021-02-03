// Definicja wektora 2D

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x + this.y)
    }

    normalize() {
        var mag = this.magnitude();
        var vector = this.clone();
        if (Math.abs(mag) < 1e-9) {
            vector.x = 0;
            vector.y = 0;
        } else {
            vector.x /= mag;
            vector.y /= mag;
        }
        return vector;
    }
}

class Planet {

    constructor(position, velocity, distance, mass, radius, gravConst) {
        this.position = position;
        this.velocity = velocity;
        this.distance = distance;
        this.mass = mass;
        this.radius = radius;
        this.gravConst = gravConst;
    }

    update(dt, sun) {
        position += velocity * dt;
        distance = sun.position - this.position;
        let distFromSun = Math.pow(distance.length(), 2)

        this.velocity += this.gravConst * (sun.mass / distFromSun) * distance.normalize() * dt;
    }

    setup(position, velocity, distance, mass, radius) {
        this.position = position;
        this.velocity = velocity;
        this.distance = distance;
        this.mass = mass;
        this.radius = radius;
    }

    draw() {
        //TODO implement this shit
    }
}

let wesolaPlaneta = new Planet(new Vector2D(2, 3), new Vector2D(1, 1), new Vector2D(0, 0), 10, 1, 8.91);
//console.log(wesolaPlaneta);