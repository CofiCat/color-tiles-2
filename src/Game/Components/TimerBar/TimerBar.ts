import { Container, Graphics } from "pixi.js";

export default class {
  private maxTime: number;
  private curTime: number;
  private container: Container;
  private progressContainer: Container;
  private width: number;
  private penaltyStrength: number;
  private height: number;
  // private progressBar: Graphics;
  constructor(maxTime: number, width: number, height: number) {
    this.maxTime = maxTime;
    this.curTime = maxTime;
    this.container = new Container();
    this.progressContainer = new Container();
    this.width = width;
    this.height = height;
    this.penaltyStrength = this.maxTime / 10;
    this.init();
  }

  init() {
    const graphics = new Graphics();
    graphics.beginFill(0x222222);
    const outer = graphics.drawRoundedRect(0, 0, this.width, this.height, 0.2);
    this.drawProgress();
    this.container.addChild(outer, this.progressContainer);
  }

  render() {
    return this.container;
  }

  tick(deltaTime: number) {
    this.curTime -= 1 * deltaTime;
    this.drawProgress();
  }

  drawProgress() {
    this.progressContainer.removeChildren();

    const remainder = this.width / (this.maxTime / this.curTime);

    const graphics = new Graphics();
    graphics.beginFill(0x444444);
    const progress = graphics.drawRoundedRect(
      0,
      0,
      remainder,
      this.height,
      0.2
    );
    this.progressContainer.addChild(progress);
  }

  getContainer() {
    return this.container;
  }

  hasLifetime() {
    return false;
  }
  hasEnded() {
    return this.curTime <= 0;
  }
  applyPenalty() {
    this.curTime -= this.penaltyStrength;
  }
  reset() {
    this.curTime = this.maxTime;
  }
}
