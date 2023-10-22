import { Graphics, Container } from "pixi.js";

export default class Board {

  height: number;
  width: number;
  tileWidth: number;
  handleTileClick: Function;

  constructor (boardHeight: number, boardWidth: number, tileWidth: number, handleTileClick: Function) {
    this.height = boardHeight;
    this.width = boardWidth;
    this.tileWidth = tileWidth;
    this.handleTileClick = handleTileClick;

  }
  
  createGrid(): Container {
    const container = new Container();
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const graphics = new Graphics()
        if ((x + y) % 2 === 1) graphics.beginFill(0xeeeeee)
        else graphics.beginFill(0xdddddd);
  
        const rect = graphics.drawRect(x * this.tileWidth, y * this.tileWidth, this.tileWidth, this.tileWidth)
        rect.eventMode = "dynamic"
        rect.onpointerdown = (event) => {
          this.handleTileClick(rect);
        }
        container.addChild(rect)
      }
    }
    return container
  }
}