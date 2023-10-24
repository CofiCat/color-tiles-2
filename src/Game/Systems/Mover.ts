type Vector2 = {
  x: number,
  y: number,
}

const scale = 60;
const gravity = .2 / scale
const drag = .00001 / scale;

const terminalVelocity = 10 / scale;
export default class Mover {
  mass: number
  pos: Vector2
  velocity: Vector2
  acceleration: Vector2
  hasGravity: boolean

  constructor(x: number, y: number, mass: number, velocity?: Vector2, acceleration?: Vector2, hasGravity?: boolean) {
    this.pos = { x, y }
    this.velocity = velocity ?? { x: 0, y: 0 }
    this.acceleration = acceleration ?? { x: 0, y: 0 }
    this.hasGravity = hasGravity ?? false
    this.mass = mass ?? 1;
  }

  update() {
    this.acceleration.y += (this.hasGravity ? gravity : 0);

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
    this.velocity.x = clamp(this.velocity.x, -2, 2);
    this.velocity.x = clamp(this.velocity.x, -2, 2);

    this.velocity.x
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // this.acceleration.x *= drag;
    // this.acceleration.y *= drag;

    // this.acceleration.x = this.acceleration.x < 0 ? 0 : this.acceleration.x;
    // this.acceleration.x = this.acceleration.x < 0 ? 0 : this.acceleration.x;
  }

  applyForce(force: Vector2) {
    force.x /= scale;
    force.y /= scale;
    this.acceleration.x += force.x / this.mass
    this.acceleration.y += force.y / this.mass
  }

  clearAcceleration() {
    this.acceleration.x = 0;
    this.acceleration.y = 0;
  }

  clearVelocity() {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }

  setHasGravity(hasGravity: boolean) {
    this.hasGravity = hasGravity;
  }

}

function clamp(val: number, min?: number, max?: number) {
  console.log('val', val)
  if (min && val < min) {
    return min;
  }
  else if (max && val > max) {
    return max;
  }
  return val;
}