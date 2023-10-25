import { Container, BitmapText, Text } from "pixi.js";

export default class Score {
  private score: number;
  private prevScore: number;
  private container: Container;
  constructor() {
    this.score = 0;
    this.prevScore = this.score;
    this.container = new Container();
    this.container.scale.set(0.02);
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
      fontSize: 24,
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
}
