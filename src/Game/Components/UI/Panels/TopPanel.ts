import type { Dimensions } from "../../../types/2d.utils";
import { Container, DisplayObject, Graphics } from "pixi.js";

export default class TopPanel {
  container: any;
  dims: Dimensions;
  timerRender: Container<DisplayObject>;

  constructor(dims: Dimensions, timerRender: Container<DisplayObject>) {
    this.container = new Container();
    this.dims = dims;
    this.timerRender = timerRender;
    this.init();
  }

  init() {
    this.container.width = this.dims.width;
    this.container.height = this.dims.height;

    const graphics = new Graphics();
    graphics.beginFill(0xf0c547);

    const rect = graphics.drawRect(0, 0, this.dims.width, this.dims.height);

    this.timerRender.height = this.dims.height / 1.5;
    this.timerRender.y = this.timerRender.height / 4;

    this.container.addChild(rect);
  }

  render() {
    return this.container;
  }
}
