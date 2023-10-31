//---
import { Container, curves, DisplayObject, Graphics } from "pixi.js";
import Block from "../../../../Block/Block";
import TileManifest from "../../../../Block/blockManifest";

import {
  genRandomCoord,
  IntersectionChecker,
} from "../../../../../Systems/util";
import type Score from "../../../Score/Score";
import type TimerBar from "../../../../TimerBar/TimerBar";
import { ctx, score } from "../../../../../../layouts/ctxStore";
import type { Coords, Dimensions } from "../../../../../types/2d.utils";

import { Howl } from "howler";
import type ContextManager from "../../../../../Systems/ContextManager";
import SoundManager from "../../../../../Systems/SoundManager";
import type { intersection } from "astro/zod";
import { clamp } from "../../../../../Systems/Mover";

const baseUrl = import.meta.env.BASE_URL;
//---

export default class EndlessLogicController {
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
  container: Container<DisplayObject>;
  interactable: boolean;

  constructor(
    boardDims: Dimensions,
    tileWidth: number,
    score: Score,
    timer: TimerBar,
    context: ContextManager,
    private dims: Dimensions
  ) {
    this.context = context;
    this.boardData = new Array(boardDims.height)
      .fill(null)
      .map(() => new Array(boardDims.width).fill(null));
    this.tileWidth = tileWidth;
    this.moveStack = [];
    this.interactable = true;
    this.tickers = [];
    this.score = score;
    this.timer = timer;
    this.gameover = false;
    const blockDensity = 0.71;
    this.numTiles = Math.round(
      boardDims.height * boardDims.width * blockDensity
    );
    this.container = new Container();
    this.soundManager = new SoundManager();
    this.init();
  }

  init() {
    this.generateTiles();
    // const animator = new BlockBoardAnimator(this.container);
    // this.tickers.push(animator);
  }
  drawGhostContainer() {
    const graphics = new Graphics();
    graphics.beginFill(0x000000, 0);
    const rect = graphics.drawRect(0, 0, this.dims.width, this.dims.height);
    this.container.addChild(rect);
  }

  animateBoardDrop() {
    this.interactable = false;
    this.container.y = -1 * this.container.height;
  }

  tick(deltaTime: number) {
    if (this.context.getContext() === "GameOver") return;
    if (this.timer.hasEnded() || this.gameover === true) {
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
    console.log(this.tickers);
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

  render() {
    return this.container;
  }
  /**
   *
   * @returns Container with Block sprites
   */
  generateTiles() {
    this.clearBoardData();
    this.drawGhostContainer();

    const tileContainer = new Container();
    const numPairs = Math.round(this.numTiles / 2);
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
          tileContainer.addChild(cur.getSprite());
        }
      }
    }
    this.container.sortableChildren = true;
    tileContainer.sortableChildren = true;
    this.container.addChild(tileContainer);
    const animator = new BlockBoardAnimator(tileContainer, this);
    this.tickers.push(animator);
    console.log(this.getBlockCount());
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
    if (this.gameover || !this.interactable) return;

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

    const adjHits = this.clearAdjacentBlocks(hits);
    const totalHits = new Set([...adjHits, ...hits]);
    console.log("after", hits);
    let i = -1;
    totalHits.forEach(async (block: Block) => {
      // increaseScore()
      this.handleBlockHit(block);
    });
    // adjHits.forEach((block) => {
    //   this.handleBlockHit(block);
    // });

    if (hits.size > 0) {
      this.moveStack.push(hits);
      this.soundManager.effects.pop();
      // const popSound = new Howl({
      //   src: [`${baseUrl}/sounds/effects/pop.mp3`],
      //   volume: 0.2,
      // });
      // popSound.play();

      // this.score.addPoints(totalHits.size);
      // this.gameover = !this.checkBoardSolvable();
      if (!this.checkBoardSolvable()) {
        // this.clearBoardData();
        this.clearAllBlocks();
        this.handleBoardClear();
      }
    } else {
      this.handleMiss();
    }
    // if (hits.size === 0) {
    //   progressTimer.value -= 200;
    // }
  }
  async handleBoardClear() {
    await setTimeout(() => {
      this.generateTiles();
      this.timer.addTime(100);
    }, 1000);
  }

  clearAllBlocks() {
    this.boardData.forEach((row) => {
      row.forEach((block) => {
        if (block != null) {
          this.tickers.push(block);
          console.log("clearing block");
          block.destroyed = true;
          block.hasGravity = true;
          block.getSprite().zIndex = 1000;
          block.applyForce({ x: Math.random() * 10 - 5, y: -5 });
          const blockPos = block.getBoardPos();
          this.boardData[blockPos.y][blockPos.x] = null;
        }
      });
    });
  }
  handleBlockHit(block: Block) {
    this.tickers.push(block);
    this.score.addPoints(1);
    this.timer.addTime(10);
    block.destroyed = true;
    block.hasGravity = true;
    block.getSprite().zIndex = 1000;
    block.applyForce({ x: Math.random() * 10 - 5, y: -5 });
    const blockPos = block.getBoardPos();
    this.boardData[blockPos.y][blockPos.x] = null;
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

  clearAdjacentBlocks(initialBlocks: Set<Block>) {
    const seen = new Set<Coords>();
    const hits = new Set<Block>();

    // initialBlocks.forEach((block) => {
    //   seen.add(block.getBoardPos());
    // });
    //   const clearAdjacentBlock = (block: Block | null, parentColor: string) => {
    //     // console.log(block);
    //     if (block === null) {
    //       console.log("empty space");
    //       return;
    //     }
    //     if (seen.has(block.getBoardPos())) return;
    //     seen.add(block.getBoardPos());
    //     if (this.isOutOfBounds(block.getBoardPos())) return;
    //     if (block.data.color != parentColor) {
    //       console.log("not the same color");
    //       return;
    //     }
    //     hits.add(block);
    //     clearAdjacentBlock(this.getBlockAbove(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockBelow(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockLeft(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockRight(block), block.data.color);
    //   };

    //   // start initial recursion
    //   initialBlocks.forEach((block) => {
    //     clearAdjacentBlock(this.getBlockAbove(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockBelow(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockLeft(block), block.data.color);
    //     clearAdjacentBlock(this.getBlockRight(block), block.data.color);
    //   });
    //   console.log(hits);
    //   return hits;
    // }
    const clearAdjacentBlock = (pos: Coords) => {
      if (this.isPosOutOfBounds(pos)) return;
      if (seen.has(pos)) return;
      const cur = this.boardData[pos.y][pos.x];
      if (cur === null) return;
      seen.add(pos);
      const up = this.getBlockAbovePos(pos);
      const down = this.getBlockBelowPos(pos);
      const left = this.getBlockLeftPos(pos);
      const right = this.getBlockRightPos(pos);
      console.log({ cur, up, down, left, right });
      if (up && up.data.color === cur.data.color) {
        hits.add(up);
        clearAdjacentBlock(up.getBoardPos());
      }
      if (down && down.data.color === cur.data.color) {
        hits.add(down);
        clearAdjacentBlock(down.getBoardPos());
      }
      if (left && left.data.color === cur.data.color) {
        hits.add(left);
        clearAdjacentBlock(left.getBoardPos());
      }
      if (right && right.data.color === cur.data.color) {
        hits.add(right);
        clearAdjacentBlock(right.getBoardPos());
      }
    };
    initialBlocks.forEach((block) => {
      clearAdjacentBlock(block.getBoardPos());
    });
    return hits;
  }

  getBlockAtPos(pos: Coords) {
    if (this.isPosOutOfBounds(pos)) return null;
    return this.boardData[pos.y][pos.x];
  }
  getBlockAboveBlock(block: Block) {
    const pos = { x: block.getBoardPos().x, y: block.getBoardPos().y-- };
    if (this.isPosOutOfBounds(pos)) return null;
    return this.boardData[pos.y][pos.x] ?? null;
  }
  getBlockBelowBlock(block: Block) {
    const pos = { x: block.getBoardPos().x, y: block.getBoardPos().y++ };
    if (this.isPosOutOfBounds(pos)) return null;
    return this.boardData[pos.y][pos.x] ?? null;
  }
  getBlockLeftBlock(block: Block) {
    const pos = { x: block.getBoardPos().x--, y: block.getBoardPos().y };
    if (this.isPosOutOfBounds(pos)) return null;
    return this.boardData[pos.y][pos.x--] ?? null;
  }
  getBlockRightBlock(block: Block) {
    const pos = { x: block.getBoardPos().x++, y: block.getBoardPos().y };
    if (this.isPosOutOfBounds(pos)) return null;
    return this.boardData[pos.y][pos.x] ?? null;
  }

  getBlockAbovePos(pos: Coords) {
    const newPos = { x: pos.x, y: pos.y - 1 };
    if (this.isPosOutOfBounds(newPos)) return null;
    return this.boardData[newPos.y][newPos.x];
  }
  getBlockBelowPos(pos: Coords) {
    const newPos = { x: pos.x, y: pos.y + 1 };
    if (this.isPosOutOfBounds(newPos)) return null;
    return this.boardData[newPos.y][newPos.x];
  }
  getBlockLeftPos(pos: Coords) {
    const newPos = { x: pos.x - 1, y: pos.y };
    if (this.isPosOutOfBounds(newPos)) return null;
    return this.boardData[newPos.y][newPos.x];
  }
  getBlockRightPos(pos: Coords) {
    const newPos = { x: pos.x + 1, y: pos.y };
    if (this.isPosOutOfBounds(newPos)) return null;
    return this.boardData[newPos.y][newPos.x];
  }
  isPosOutOfBounds(pos: Coords) {
    return (
      pos.x < 0 ||
      pos.x > this.boardData[0].length - 1 ||
      pos.y < 0 ||
      pos.y > this.boardData.length - 1
    );
  }

  checkBoardSolvable() {
    let solvable = false;
    this.boardData.forEach((row, y) => {
      row.forEach((block, x) => {
        if (block === null) {
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
          console.log(hits.size);
          if (hits.size > 0) {
            solvable = true;
          }
        }
      });
    });
    return solvable;
  }

  calcDistance(pos1: Coords, pos2: Coords) {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2)
    );
  }
}

class BlockBoardAnimator {
  lifetime: number;
  constructor(
    private container: Container<DisplayObject>,
    private logicController: EndlessLogicController
  ) {
    this.lifetime = 100;
    this.init();
  }

  init() {
    this.container.y = -1 * this.container.height;
    this.logicController.interactable = false;
  }
  tick() {
    const speed = 0.5;
    this.container.y = clamp(this.container.y + speed, -100000, 0);
    if (this.container.y > 0) {
      this.container.y = 0;
    } else {
      this.logicController.interactable = true;
    }
    this.lifetime -= 1;
    console.log(this.container.y);
  }
  getLifetime() {
    console.log(this.lifetime);
    return this.lifetime;
  }
  hasLifetime() {
    return true;
  }
}
