import { Sprite } from "pixi.js";
import { Howl, Howler } from 'howler';
import type BlockManifest from "./blockManifest";
import Mover from "../../Systems/Mover";
import Animator from "../../Systems/Animator";

export default class Block extends Mover {
  sprite: Sprite
  destroyed: boolean
  boardPos: { x: number, y: number }
  data: typeof BlockManifest[number]
  lifetime: number

  constructor(data: typeof BlockManifest[number], x: number, y: number, width: number) {
    super(x, y, 1)
    this.sprite = Sprite.from(data.path);
    this.sprite.x = x;
    this.sprite.y = y;
    this.boardPos = { x, y }
    this.sprite.width = width;
    this.sprite.height = width;
    this.destroyed = false;
    this.data = data;
    this.lifetime = 60;
  }

  /**
   * Get the position of a sprite in PIXI stage
   * @returns Object with x and y position
   */
  getWorldPos() {
    return { x: this.sprite.x, y: this.sprite.y }
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

  setBoardPos() {

  }

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
    this.sprite.destroy()
  }

  getWorldBoundingBox() {

  }

  tick() {
    this.update();
    this.sprite.x = this.pos.x;
    this.sprite.y = this.pos.y;
    if (this.destroyed) {
      this.lifetime -= 1;
      this.clearBlockAnimation()
    }

  }

  clearBlockAnimation() {
    console.log(this.lifetime);
    if (this.lifetime <= 0) {
      this.destroy()
    }


    const velocity = { x: 1, y: 1 }
    const acceleration = { x: 0, y: 0 }
    const gravity = .02;
    // const anim = window.setInterval((xDir: number) => {
    // this.sprite.x += velocity.x * xDir;
    // this.sprite.y += velocity.y
    // velocity.y += acceleration.y + gravity;
    // velocity.x += acceleration.x
    // this.sprite.rotation += xDir / 100;
    // }, 1000 / 50, Math.random() * 2 - 1)

    // window.setTimeout(() => {
    //   window.clearInterval(anim)
    //   this.destroy();
    //   console.log('destroyed object')
    // }, 2000)
  }
}