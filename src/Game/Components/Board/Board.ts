import { Graphics, Container } from "pixi.js";
import type { Dimensions } from "../../types/2d.utils";

export default class Board {
  container: any;

  constructor(
    public dims: Dimensions,
    public tileWidth: number,
    public handleTileClick: Function,
    public colorPrim: number,
    public colorOff: number
  ) {
    this.dims = dims;
    this.tileWidth = tileWidth;
    this.handleTileClick = handleTileClick;
    this.colorPrim = colorPrim;
    this.colorOff = colorOff;
    this.container = new Container();
    this.init();
  }

  init() {
    for (let y = 0; y < this.dims.height; y++) {
      for (let x = 0; x < this.dims.width; x++) {
        const graphics = new Graphics();
        if ((x + y) % 2 === 1) graphics.beginFill(this.colorPrim);
        else graphics.beginFill(this.colorOff);

        const rect = graphics.drawRect(
          x * this.tileWidth,
          y * this.tileWidth,
          this.tileWidth,
          this.tileWidth
        );
        rect.eventMode = "dynamic";
        rect.onpointerdown = (event) => {
          this.handleTileClick(x, y);
        };
        this.container.addChild(rect);
      }
    }
  }

  render() {
    return this.container;
  }
}
