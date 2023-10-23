import { Sprite } from "pixi.js";
import { Howl, Howler } from 'howler';
import type BlockManifest from "./blockManifest";

export default class Block {
  sprite: Sprite
  destroyed: boolean
  boardPos: { x: number, y: number }
  data: typeof BlockManifest[number]

  constructor(data: typeof BlockManifest[number], x: number, y: number, width: number) {
    this.sprite = Sprite.from(data.path);
    this.sprite.x = x * width;
    this.sprite.y = y * width;
    this.boardPos = { x, y }
    this.sprite.width = width;
    this.sprite.height = width;
    this.destroyed = false;
    this.data = data;
  }

  getWorldPos() {
    return { x: this.sprite.x, y: this.sprite.y }
  }

  getBoardPos() {
    return this.boardPos;
  }

  setPos(x: number, y: number) {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  getSprite() {
    return this.sprite;
  }

  destroy() {
    this.sprite.destroy()
  }

  clearBlockAnimation() {
    // const popSound = new Howl({
    //   src: ['/sounds/effects/pop.mp3'],
    //   volume: .5
    // })

    // window.setTimeout(() => {
    //   popSound.play();
    // }, Math.random() * 500)

    const velocity = { x: 10, y: -10 }
    const acceleration = { x: 0, y: 0 }
    const gravity = 4;
    const anim = window.setInterval((xDir: number) => {
      this.sprite.x += velocity.x * xDir;
      this.sprite.y += velocity.y
      velocity.y += acceleration.y + gravity;
      velocity.x += acceleration.x
      this.sprite.rotation += xDir / 100;
    }, 1000 / 50, Math.random() * 10 - 5)

    window.setTimeout(() => {
      window.clearInterval(anim)
      this.destroy();
    }, 2000)
  }
}