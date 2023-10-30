import type { Dimensions } from "../../../types/2d.utils";
import { Container, Graphics } from "pixi.js";

export default class BottomPanel {
  container: any;
  dims: Dimensions;

  constructor(dims: Dimensions) {
    this.container = new Container();
    this.dims = dims;
    this.init();
  }

  init() {
    this.container.width = this.dims.width;
    this.container.height = this.dims.height;

    const graphics = new Graphics();
    graphics.beginFill(0xf0c547);

    const rect = graphics.drawRect(0, 0, this.dims.width, this.dims.height);
    this.container.addChild(rect);
  }

  render() {
    return this.container;
  }
}
