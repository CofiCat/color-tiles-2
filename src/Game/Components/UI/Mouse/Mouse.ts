import { Container, Graphics } from "pixi.js";
import type { Coords } from "../../../types/2d.utils";

export default class Mouse {
  container: Container;
  constructor() {
    this.container = new Container();
    this.init();
  }

  init() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff, 0.5);
    const circle = graphics.drawCircle(0, 0, 23);
    this.container.addChild(circle);
    // this.container.scale.set(0.03);
  }

  update(mouseCoords: Coords) {
    this.container.position.x = mouseCoords.x;
    this.container.position.y = mouseCoords.y;
  }

  render() {
    return this.container;
  }
}
