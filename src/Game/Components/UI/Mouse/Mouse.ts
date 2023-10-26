import { Container, DisplayObject, Graphics } from "pixi.js";
import type { Coords } from "../../../types/2d.utils";

export default class Mouse {
  container: Container;
  stage: Container<DisplayObject>;
  constructor(stage: Container<DisplayObject>) {
    this.container = new Container();
    this.stage = stage;
    this.init();
  }

  init() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff, 0.5);
    const circle = graphics.drawCircle(0, 0, 23);
    this.container.addChild(circle);
    this.container.renderable = false;
    // this.container.scale.set(0.03);

    this.stage.onmousemove = (event) => {
      this.container.renderable = true;
      // console.log("updating mouse position");
      this.tick({ x: event.screenX, y: event.screenY });
    };
  }

  tick(mouseCoords: Coords) {
    this.container.position.x = mouseCoords.x;
    this.container.position.y = mouseCoords.y;
  }

  render() {
    return this.container;
  }
}
