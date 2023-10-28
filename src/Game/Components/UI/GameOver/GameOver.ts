import { Application, Container, DisplayObject, Graphics, Text } from "pixi.js";
import type { Dimensions } from "../../../types/2d.utils";
import type ContextManager from "../../../Systems/ContextManager";
import MenuButton from "../Buttons/MenuButton";

export default class GameOver {
  container: Container;
  dims: Dimensions;
  app: Application;
  context: ContextManager;
  score: number;
  constructor(
    score: number,
    dims: Dimensions,
    app: Application,
    context: ContextManager
  ) {
    this.score = score;
    this.app = app;
    this.container = new Container();
    this.dims = dims;
    this.context = context;
    this.init();
  }

  init() {
    const padding = 10;
    this.container.name = "GameOver";
    this.container.eventMode = "dynamic";
    const graphics = new Graphics();
    graphics.beginFill(0x303443, 0.4);
    const background = graphics.drawRect(
      0,
      0,
      this.dims.width,
      this.dims.height
    );

    const gameOverText = this.createGameOverText();
    const scoreText = this.createScoreText();
    scoreText.y += gameOverText.height + padding;

    const button = new MenuButton(
      "Restart",
      this.dims.width / 2,
      this.dims.height / 12,
      this.dims.width / 25,
      () => {
        this.context.setContext("ClassicMode");
        // this.container.renderable = false;
      }
    );

    const buttonRender = button.render();
    buttonRender.x = this.dims.width / 2 - buttonRender.width / 2;
    buttonRender.y =
      scoreText.y + buttonRender.height + scoreText.height + padding;

    this.container.addChild(background, gameOverText, scoreText, buttonRender);
    return this.container;
  }

  render() {
    return this.container;
  }

  destroy() {
    this.container.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });
  }

  createGameOverText() {
    const container = new Container();

    const text = new Text("Game Over", {
      fontSize: this.dims.width / 10,
      fontWeight: "bold",
      fill: 0xffffff,
    });

    container.addChild(text);
    container.x = this.dims.width / 2 - container.width / 2;
    container.y = this.dims.height / 4 - container.height;

    // container.scale.set(0.05);
    return container;
  }
  createScoreText() {
    const container = new Container();
    const text = new Text(`Score: ${this.score}`, {
      fontSize: this.dims.width / 12,
      fontWeight: "bold",
      fill: 0xaaffff,
    });

    container.addChild(text);
    container.x = this.dims.width / 2 - container.width / 2;
    container.y = this.dims.height / 4 - container.height;

    // container.scale.set(0.05);
    return container;
  }
}
