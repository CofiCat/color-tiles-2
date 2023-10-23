import { Container, Graphics } from "pixi.js";
import { mouseCoordinatesToTileIndex } from "../../Systems/util";
import { IntersectionChecker } from "../../Systems/util";
import type Block from "../Block/Block";


type Coords = {
  x: number,
  y: number,
}

/**
 * WHAT THIS NEEDS TO RUN
 * ----------------------
 * 1. mouse position in the world
 * 2. position of first collision on each axis
 * 
 */
export default class AttackIndicator {
  container: Container
  cursor: Container
  tileWidth: number
  board: Array<Array<Block | null>>
  gridSnap: boolean
  boardCoords: Coords
  constructor(tileWidth: number, board: Array<Array<Block | null>>) {
    this.container = new Container();
    this.cursor = new Container();
    this.tileWidth = tileWidth;
    this.board = board;
    this.gridSnap = true;
    this.boardCoords = { x: 0, y: 0 }
  }

  render() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff, .5);
    const circle = graphics.drawCircle(0, 0, 20)
    this.cursor.addChild(circle);
    return [this.container, this.cursor];
  }

  update(mouseCoords: Coords) {
    this.boardCoords = mouseCoordinatesToTileIndex(mouseCoords.x, mouseCoords.y, this.tileWidth);
    this.cursor.position.x = mouseCoords.x;
    this.cursor.position.y = mouseCoords.y;
    if (this.gridSnap) {
      console.log(this.boardCoords)
      this.container.x = this.boardCoords.x * this.tileWidth + (this.tileWidth / 2)
      this.container.y = this.boardCoords.y * this.tileWidth + (this.tileWidth / 2)
    } else {
      this.container.x = mouseCoords.x;
      this.container.y = mouseCoords.y;
    }

    const removed = this.container.removeChildren();
    this.drawLeft(mouseCoords);
    this.drawRight(mouseCoords);
    this.drawUp(mouseCoords);
    this.drawDown(mouseCoords);

    // removed.forEach((val) => {
    //   console.log(val.destroy());
    //   // val.destroy();
    // })
  }

  drawLeft(mouseCoords: Coords) {
    const leftContainer = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.beginFill(0xffffff, .1);

    let right = IntersectionChecker.getFirstLeft(this.boardCoords.x, this.boardCoords.y, this.board)

    for (let i = 1; i < this.boardCoords.x - (right ? right.boardPos.x : -1); i++) {
      const circle = graphics.drawCircle(-i * this.tileWidth, 0, 10);
      leftContainer.addChild(circle)
    }
    this.container.addChild(leftContainer);
  }

  drawRight(mouseCoords: Coords) {
    const rightContainer = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.beginFill(0xffffff, .1);

    let right = IntersectionChecker.getFirstRight(this.boardCoords.x, this.boardCoords.y, this.board)

    for (let i = 1; i < (right ? right.boardPos.x : this.board[0].length) - this.boardCoords.x; i++) {
      const circle = graphics.drawCircle(i * this.tileWidth, 0, 10);
      rightContainer.addChild(circle)
    }
    this.container.addChild(rightContainer);
  }

  drawUp(mouseCoords: Coords) {
    const container = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.beginFill(0xffffff, .1);

    let up = IntersectionChecker.getFirstUp(this.boardCoords.x, this.boardCoords.y, this.board)

    for (let i = 1; i < this.boardCoords.y - (up ? up.getBoardPos().y : -1); i++) {
      const circle = graphics.drawCircle(0, -i * this.tileWidth, 10);
      container.addChild(circle)
    }
    this.container.addChild(container);
  }

  drawDown(mouseCoords: Coords) {
    const container = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff, .1);

    let up = IntersectionChecker.getFirstDown(this.boardCoords.x, this.boardCoords.y, this.board)

    for (let i = 1; i < (up ? up.getBoardPos().y : this.board.length) - this.boardCoords.y; i++) {
      const circle = graphics.drawCircle(0, i * this.tileWidth, 10);
      container.addChild(circle)
    }
    this.container.addChild(container);
  }
}