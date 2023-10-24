import { Container, Graphics } from "pixi.js"

export default class {
  maxTime: number
  curTime: number
  container: Container
  constructor(maxTime: number) {
    this.maxTime = maxTime;
    this.curTime = 0;
    this.container = new Container()
  }

  render() {
    const graphics = new Graphics();
    graphics.beginFill(0xffffff);
    const outer = graphics.drawRoundedRect(0, 0, 100, 30, 20);
    this.container.addChild(outer);
    return this.container
  }

  update() {
    this.curTime += 1;
  }

}