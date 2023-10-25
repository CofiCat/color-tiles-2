import { Sprite } from "pixi.js";
import type BlockManifest from "./blockManifest";
import Mover from "../../Systems/Mover";

export default class Block extends Mover {
  private sprite: Sprite;
  destroyed: boolean;
  private boardPos: { x: number; y: number };
  data: (typeof BlockManifest)[number];
  private lifetime: number;

  constructor(
    data: (typeof BlockManifest)[number],
    x: number,
    y: number,
    width: number
  ) {
    super(x, y, 1);
    this.sprite = Sprite.from(data.path);
    this.sprite.x = x;
    this.sprite.y = y;
    this.boardPos = { x, y };
    this.sprite.width = width;
    this.sprite.height = width;
    this.destroyed = false;
    this.data = data;
    this.lifetime = 120;
  }

  /**
   * Get the position of a sprite in PIXI stage
   * @returns Object with x and y position
   */
  getWorldPos() {
    return { x: this.sprite.x, y: this.sprite.y };
  }

  /**
   * Get the index of object relative to game board
   * @returns Object with x and y position
   */
  getBoardPos() {
    return this.boardPos;
  }

  /**
   * set current position of sprite in world
   * @param x pos
   * @param y pos
   */
  setWorldPos(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  setBoardPos() {}

  /**
   *
   * @returns sprite ref
   */
  getSprite() {
    return this.sprite;
  }

  /**
   * destorys current sprite
   */
  destroy() {
    this.sprite.destroy();
  }

  getWorldBoundingBox() {}

  tick() {
    this.update();
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    this.sprite.rotation = this.rotation;

    if (this.destroyed) {
      this.lifetime -= 1;
      this.clearBlockAnimation();
    }
  }
  hasLifetime() {
    return this.hasLifetime;
  }

  getLifetime() {
    return this.lifetime;
  }

  clearBlockAnimation() {
    if (this.lifetime <= 0) {
      this.destroy();
    }
  }
}
