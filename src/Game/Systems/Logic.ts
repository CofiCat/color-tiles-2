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
  tickers: Array<any>;

  constructor(height: number, width: number, tileWidth: number) {
    this.boardData = new Array(height)
      .fill(null)
      .map(() => new Array(width).fill(null));
    this.tileWidth = tileWidth;
    this.moveStack = [];
    this.tickers = [];
  }

  tick() {
    let toRemove = new Set();
    for (let i = 0; i < this.tickers.length; i++) {
      const cur = this.tickers[i];
      if (cur.hasLifetime()) {
        if (cur.getLifetime() > 0) {
          cur.tick();
        } else {
          toRemove.add(i);
        }
      } else {
        cur.tick();
      }
    }
    if (toRemove.size === 0) return;

    let newTickers = [];
    for (let i = 0; i < this.tickers.length; i++) {
      if (!toRemove.has(i)) {
        newTickers.push(this.tickers[i]);
      }
    }
    this.tickers = newTickers;
  }

  /**
   *
   * @returns the active number of Blocks
   */
  public getBlockCount(): number {
    let count = 0;
    for (let i = 0; i < this.boardData.length; i++) {
      for (let j = 0; j < this.boardData[0].length; j++) {
        if (this.boardData[i][j] != null) count++;
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

      this.setTileAtPos(
        tileData,
        randomPair[0].x,
        randomPair[0].y,
        this.tileWidth
      );
      this.setTileAtPos(
        tileData,
        randomPair[1].x,
        randomPair[1].y,
        this.tileWidth
      );
    }

    for (let i = 0; i < this.boardData.length; i++) {
      for (let j = 0; j < this.boardData[0].length; j++) {
        const cur = this.boardData[i][j];
        if (cur) {
          container.addChild(cur.getSprite());
        }
      }
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
  private setTileAtPos(
    data: (typeof TileManifest)[number],
    x: number,
    y: number,
    tileWidth: number
  ): Block {
    const block = new Block(data, x, y, tileWidth);
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
          if (
            val1?.data?.color === val2?.data?.color &&
            val1 != null &&
            val2 != null
          ) {
            hits.add(val1);
            hits.add(val2);
          }
        }
      });
    });

    hits.forEach((block: Block) => {
      // increaseScore()
      this.tickers.push(block);
      block.destroyed = true;
      block.hasGravity = true;
      block.applyForce({ x: Math.random() * 5 - 2.5, y: -3 });
      const blockPos = block.getBoardPos();
      this.boardData[blockPos.y][blockPos.x] = null;
    });

    if (hits.size > 0) {
      this.moveStack.push(hits);
      const popSound = new Howl({
        src: ["/sounds/effects/pop.mp3"],
        volume: 0.1,
      });

      popSound.play();
    }
    // if (hits.size === 0) {
    //   progressTimer.value -= 200;
    // }
  }

  undo(stage: Container<DisplayObject>) {
    const prevMove = this.moveStack.pop();
    if (!prevMove) return;
    prevMove.forEach((block: Block) => {
      const newBlock = this.setTileAtPos(
        block.data,
        block.getBoardPos().x,
        block.getBoardPos().y,
        this.tileWidth
      );
      stage.addChild(newBlock.sprite);
    });
  }

  addTickers(data: [any]) {
    this.tickers.push(...data);
  }
}
