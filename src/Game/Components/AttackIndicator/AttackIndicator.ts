import { Container, Graphics } from "pixi.js";
import { mouseCoordinatesToTileIndex } from "../../Systems/util";
import { IntersectionChecker } from "../../Systems/util";
import type Block from "../Block/Block";

import type { Coords } from "../../types/2d.utils";

/**
 * WHAT THIS NEEDS TO RUN
 * ----------------------
 * 1. mouse position in the world
 * 2. position of first collision on each axis
 *
 */
export default class AttackIndicator {
  container: Container;
  cursor: Container;
  tileWidth: number;
  board: Array<Array<Block | null>>;
  gridSnap: boolean;
  tracerRadius: number;
  boardCoords: Coords;
  scale: number;
  constructor(tileWidth: number, board: Array<Array<Block | null>>) {
    this.container = new Container();
    this.cursor = new Container();
    this.tileWidth = tileWidth;
    this.board = board;
    this.gridSnap = true;
    this.tracerRadius = 1;
    this.boardCoords = { x: 0, y: 0 };
    this.scale = 0.15;
  }

  render() {
    return [this.container, this.cursor];
  }

  update(mouseCoords: Coords) {
    this.boardCoords = mouseCoordinatesToTileIndex(
      mouseCoords.x,
      mouseCoords.y,
      this.tileWidth
    );
    this.cursor.position.x = mouseCoords.x;
    this.cursor.position.y = mouseCoords.y;
    if (this.gridSnap) {
      this.container.x =
        this.boardCoords.x * this.tileWidth + this.tileWidth / 2;
      this.container.y =
        this.boardCoords.y * this.tileWidth + this.tileWidth / 2;
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
    graphics.beginFill(0xffffff, 0.1);
    // console.log(this.boardCoords);
    let right = IntersectionChecker.getFirstLeft(
      this.boardCoords.x,
      this.boardCoords.y,
      this.board
    );

    for (
      let i = 1;
      i < this.boardCoords.x - (right ? right.boardPos.x : -1);
      i++
    ) {
      const circle = graphics.drawCircle(
        -i * this.tileWidth * (1 / this.scale),
        0,
        this.tracerRadius
      );
      circle.scale.set(this.scale);
      leftContainer.addChild(circle);
    }
    this.container.addChild(leftContainer);
  }

  drawRight(mouseCoords: Coords) {
    const rightContainer = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.beginFill(0xffffff, 0.1);

    let right = IntersectionChecker.getFirstRight(
      this.boardCoords.x,
      this.boardCoords.y,
      this.board
    );

    for (
      let i = 1;
      i <
      (right ? right.boardPos.x : this.board[0].length) - this.boardCoords.x;
      i++
    ) {
      const circle = graphics.drawCircle(
        i * this.tileWidth * (1 / this.scale),
        0,
        this.tracerRadius
      );
      circle.scale.set(this.scale);
      rightContainer.addChild(circle);
    }
    this.container.addChild(rightContainer);
  }

  drawUp(mouseCoords: Coords) {
    const container = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    graphics.beginFill(0xffffff, 0.1);

    let up = IntersectionChecker.getFirstUp(
      this.boardCoords.x,
      this.boardCoords.y,
      this.board
    );

    for (
      let i = 1;
      i < this.boardCoords.y - (up ? up.getBoardPos().y : -1);
      i++
    ) {
      const circle = graphics.drawCircle(
        0,
        -i * this.tileWidth * (1 / this.scale),
        this.tracerRadius
      );
      container.addChild(circle);
      circle.scale.set(this.scale);
    }
    this.container.addChild(container);
  }

  drawDown(mouseCoords: Coords) {
    const container = new Container();
    const graphics = new Graphics();
    graphics.beginFill(0xffffff, 0.1);

    let up = IntersectionChecker.getFirstDown(
      this.boardCoords.x,
      this.boardCoords.y,
      this.board
    );

    for (
      let i = 1;
      i < (up ? up.getBoardPos().y : this.board.length) - this.boardCoords.y;
      i++
    ) {
      const circle = graphics.drawCircle(
        0,
        i * this.tileWidth * (1 / this.scale),
        this.tracerRadius
      );
      circle.scale.set(this.scale);
      container.addChild(circle);
    }
    this.container.addChild(container);
  }
}
