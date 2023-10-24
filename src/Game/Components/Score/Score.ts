import { Container, Graphics } from "pixi.js";

export default class Score {
  private score: number;
  private container: Container;
  constructor() {
    this.score = 0;
    this.container = new Container();
  }

  tick() {}
  addPoints(points: number) {
    this.score += points;
  }
}
