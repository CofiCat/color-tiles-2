import { Graphics, Container } from "pixi.js";

export default class Board {
  height: number;
  width: number;
  tileWidth: number;
  handleTileClick: Function;
  colorPrim: number;
  colorOff: number;

  constructor(
    boardHeight: number,
    boardWidth: number,
    tileWidth: number,
    handleTileClick: Function,
    colorPrim: number,
    colorOff: number
  ) {
    this.height = boardHeight;
    this.width = boardWidth;
    this.tileWidth = tileWidth;
    this.handleTileClick = handleTileClick;
    this.colorPrim = colorPrim;
    this.colorOff = colorOff;
  }

  createGrid(): Container {
    const container = new Container();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
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
        container.addChild(rect);
      }
    }
    return container;
  }
}
