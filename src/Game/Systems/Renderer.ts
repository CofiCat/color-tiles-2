import { curves, type Application, DisplayObject } from "pixi.js";

export default class Renderer {
  app: any;
  updatables: any[];
  constructor(app: Application) {
    this.app = app;
    this.updatables = [];
    this.app.ticker.add((deltaTime) => {
      console.log(this.app.ticker.FPS);
      this.update(deltaTime);
    });
    this.app.ticker.maxFPS = 60;
    this.app.ticker.minFPS = 60;
  }

  update(deltaTime: number) {
    this.updatables.forEach((cur) => {
      cur.tick(deltaTime);
    });
  }

  addUpdatable(...args: any) {
    args.forEach((val: any) => this.updatables.push(val));
  }

  popUpdatable() {
    this.updatables.pop();
  }
}
