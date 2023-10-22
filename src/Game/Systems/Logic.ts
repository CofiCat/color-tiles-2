//---
import { Container, DisplayObject } from "pixi.js";
import Block from "../Components/Block/Block";
import TileManifest from "../Components/Block/blockManifest";

import { genRandomPair, IntersectionChecker } from "./util";
//---

export default class Logic {
  boardData: Array<Array<null | Block>>;
  tileWidth: number;
  moveStack: Array<Set<Block>>;
  constructor(height: number, width: number, tileWidth: number) {
    this.boardData = new Array(height).fill(null).map(() => new Array(width).fill(null));
    this.tileWidth = tileWidth
    this.moveStack = [];
  }

  /**
   * 
   * @returns the active number of Blocks
   */
  public getBlockCount(): number {
    let count = 0;
    for (let i = 0; i < this.boardData.length; i++) {
      for (let j = 0; j < this.boardData[0].length; j++) {
        if (this.boardData[i][j] != null) count++
      }
    }
    return count;
  }

  /**
   * removes sprite from scene and clear board data
   */
  private clearBoardData() {
    for (let i = 0; i < this.boardData.length; i++) {
      for (let j = 0; j < this.boardData[0].length; j++) {
        const cur = this.boardData[i][j];
        if (cur != null) {
          cur.destroy();
        }
        this.boardData[i][j] = null;
      }
    }
  }

  /**
   *
   * @returns Container with Block sprites
   */
  generateTiles() {
    this.clearBoardData();

    const numPairs = 100;
    const container = new Container();
    for (let i = 0; i < numPairs; i++) {
      // const tileWidth = 75;
      const tileData = TileManifest[i % TileManifest.length];

      const randomPair = genRandomPair(this.boardData);

      container.addChild(this.setTileAtPos(tileData, randomPair[0].x, randomPair[0].y, this.tileWidth).getSprite());
      container.addChild(this.setTileAtPos(tileData, randomPair[1].x, randomPair[1].y, this.tileWidth).getSprite());

    }
    return container;
  }

  /**
   * 
   * @param data block Manifest Data
   * @param x pos
   * @param y pos
   * @param tileWidth width of tile
   * @returns newly created Block
   */
  private setTileAtPos(data: typeof TileManifest[number], x: number, y: number, tileWidth: number): Block {
    const block = new Block(data, x, y, tileWidth)
    this.boardData[y][x] = block;
    return block;
  }

  checkClear(x: number, y: number) {
    if (this.boardData[y][x] != null) return;

    const down = IntersectionChecker.getFirstDown(x, y, this.boardData);
    const up = IntersectionChecker.getFirstUp(x, y, this.boardData);
    const left = IntersectionChecker.getFirstLeft(x, y, this.boardData);
    const right = IntersectionChecker.getFirstRight(x, y, this.boardData);

    const dirs = [left, right, up, down];
    const hits: Set<Block> = new Set();
    dirs.forEach((val1, i) => {
      dirs.forEach((val2, j) => {
        if (i != j) {
          if (val1?.data?.color === val2?.data?.color && val1 != null && val2 != null) {
            hits.add(val1);
            hits.add(val2);

          }
        }
      })
    })
    this.moveStack.push(hits);
    hits.forEach((block: Block) => {
      // increaseScore()
      console.log(block.data.color)
      block.clearBlockAnimation();
      const blockPos = block.getBoardPos();
      this.boardData[blockPos.y][blockPos.x] = null;
    })
    if (hits.size === 0) {
      progressTimer.value -= 200;
    }
  }

  undo(stage: Container<DisplayObject>) {
    const prevMove = this.moveStack.pop()
    if (!prevMove) return;
    console.log('undoing', prevMove);
    prevMove.forEach((block: Block) => {
      const newBlock = this.setTileAtPos(block.data, block.getBoardPos().x, block.getBoardPos().y, this.tileWidth);
      stage.addChild(newBlock.sprite);
    })
  }
}


// event.preventDefault()
// this.handleTileClick();
// if (!gameOver) {
//   checkClear(x, y);
//   console.log(getCount())
// }
