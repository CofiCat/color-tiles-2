import { Container, Graphics } from "pixi.js";

export default class {
  private maxTime: number;
  private curTime: number;
  private container: Container;
  private progressContainer: Container;
  private width: number;
  private penaltyStrength: number;
  // private progressBar: Graphics;
  constructor(maxTime: number, width: number) {
    this.maxTime = maxTime;
    this.curTime = maxTime;
    this.container = new Container();
    this.progressContainer = new Container();
    this.width = width;
    this.penaltyStrength = maxTime / 5;
  }

  init() {
    const graphics = new Graphics();
    graphics.beginFill(0x222222);
    const outer = graphics.drawRoundedRect(0, 0, this.width, 0.5, 0.2);
    this.drawProgress();
    this.container.addChild(outer, this.progressContainer);
    return this.container;
  }

  tick() {
    this.curTime -= 1;
    this.drawProgress();
  }

  drawProgress() {
    this.progressContainer.removeChildren();

    const remainder = this.width / (this.maxTime / this.curTime);

    const graphics = new Graphics();
    graphics.beginFill(0x444444);
    const progress = graphics.drawRoundedRect(0, 0, remainder, 0.5, 0.2);
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
