//---
import { Container, curves, DisplayObject } from "pixi.js";
import Block from "../../../../Block/Block";
import TileManifest from "../../../../Block/blockManifest";

import {
  genRandomCoord,
  IntersectionChecker,
} from "../../../../../Systems/util";
import type Score from "../../../Score/Score";
import type TimerBar from "../../../../TimerBar/TimerBar";
import { ctx, score } from "../../../../../../layouts/ctxStore";
import type { Dimensions } from "../../../../../types/2d.utils";

import { Howl } from "howler";
import type ContextManager from "../../../../../Systems/ContextManager";
import SoundManager from "../../../../../Systems/SoundManager";

const baseUrl = import.meta.env.BASE_URL;
//---

export default class ClassicLogicController {
  boardData: Array<Array<null | Block>>;
  tileWidth: number;
  moveStack: Array<Set<Block>>;
  tickers: Array<any>;
  score: Score;
  timer: TimerBar;
  gameover: boolean;
  numTiles: number;
  context: ContextManager;
  soundManager: SoundManager;

  constructor(
    boardDims: Dimensions,
    tileWidth: number,
    score: Score,
    timer: TimerBar,
    context: ContextManager
  ) {
    this.context = context;
    this.boardData = new Array(boardDims.height)
      .fill(null)
      .map(() => new Array(boardDims.width).fill(null));
    this.tileWidth = tileWidth;
    this.moveStack = [];
    this.tickers = [];
    this.score = score;
    this.timer = timer;
    this.gameover = false;
    const blockDensity = 0.71;
    this.numTiles = Math.round(
      boardDims.height * boardDims.width * blockDensity
    );
    this.soundManager = new SoundManager();
  }

  tick(deltaTime: number) {
    if (this.context.getContext() === "GameOver") return;
    if (this.timer.hasEnded()) {
      // score.set(this.score.getScore());
      this.context.data = {
        score: this.score.getScore(),
      };
      this.gameover = true;
      this.context.setContext("GameOver");
    }
    // return;
    let toRemove = new Set();
    this.tickers.forEach((cur, i) => {
      if (cur.hasLifetime()) {
        if (cur.getLifetime() > 0) {
          cur.tick(deltaTime);
        } else {
          toRemove.add(i);
        }
      } else {
        cur.tick(deltaTime);
      }
    });
    if (toRemove.size === 0) return;

    let newTickers = <Array<any>>[];
    this.tickers.forEach((cur, i) => {
      if (!toRemove.has(i)) {
        newTickers.push(this.tickers[i]);
      }
    });
    this.tickers = newTickers;
  }

  restart() {}
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

    const numPairs = Math.round(this.numTiles / 2);
    const container = new Container();
    for (let i = 0; i < numPairs; i++) {
      // const tileWidth = 75;
      const tileData = TileManifest[i % TileManifest.length];

      // const randomPair = genRandomPair(this.boardData);
      const b1 = genRandomCoord(this.boardData);
      this.setTileAtPos(tileData, b1.x, b1.y, this.tileWidth);

      const b2 = genRandomCoord(this.boardData);
      this.setTileAtPos(tileData, b2.x, b2.y, this.tileWidth);
    }

    for (let i = 0; i < this.boardData.length; i++) {
      for (let j = 0; j < this.boardData[0].length; j++) {
        const cur = this.boardData[i][j];
        if (cur) {
          container.addChild(cur.getSprite());
        }
      }
    }
    container.sortableChildren = true;
    console.log(this.getBlockCount());
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
    if (this.gameover) return;

    if (this.boardData[y][x] != null) {
      this.handleMiss();
      return;
    }

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
      block.getSprite().zIndex = 1000;
      block.applyForce({ x: Math.random() * 10 - 5, y: -5 });
      const blockPos = block.getBoardPos();
      this.boardData[blockPos.y][blockPos.x] = null;
    });

    if (hits.size > 0) {
      this.moveStack.push(hits);
      // const popSound = new Howl({
      //   src: [`${baseUrl}/sounds/effects/pop.mp3`],
      //   volume: 0.2,
      // });
      this.soundManager.effects.pop();
      // popSound.play();

      this.score.addPoints(hits.size);
    } else {
      this.handleMiss();
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

  addTickers(data: Array<any>) {
    this.tickers.push(...data);
  }

  handleMiss() {
    this.soundManager.effects.swish();
    this.timer.applyPenalty();
  }
}
