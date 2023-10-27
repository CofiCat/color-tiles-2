import { Container, BitmapText, Text, Application } from "pixi.js";

export default class Score {
  private score: number;
  private prevScore: number;
  private container: Container;
  private app: Application;
  constructor(app: Application) {
    this.score = 0;
    this.prevScore = this.score;
    this.container = new Container();
    this.app = app;
  }

  init() {
    this.update();
    return this.container;
  }

  tick() {
    if (this.prevScore != this.score) {
      this.update();
    }
  }

  update() {
    this.container.removeChildren();
    const text = new Text(`Score: ${this.score}`, {
      fontSize: this.app.screen.width / 40,
      fill: 0xffffff,
      // align: "right",
    });
    this.container.addChild(text);
  }

  addPoints(points: number) {
    this.score += points;
    console.log(this.score);
  }

  getContainer() {
    return this.container;
  }

  hasLifetime() {
    return false;
  }

  getScore() {
    return this.score;
  }

  render() {
    return this.container;
  }
}
