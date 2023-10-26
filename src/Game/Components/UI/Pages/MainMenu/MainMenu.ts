import { Application, Container, DisplayObject, Graphics, Text } from "pixi.js";
import MenuButton from "../../Buttons/MenuButton";
import type { Dimensions } from "../../../../types/2d.utils";
import type { Context } from "../../../../Systems/ContextManager";
import type ContextManager from "../../../../Systems/ContextManager";

export default class MainMenu {
  container: Container;
  dims: Dimensions;
  app: Application;
  context: ContextManager;
  constructor(dims: Dimensions, app: Application, context: ContextManager) {
    this.app = app;
    this.container = new Container();
    this.dims = dims;
    this.context = context;
    this.init();
  }

  init() {
    this.container.name = "MainMenu";
    this.container.eventMode = "dynamic";
    const graphics = new Graphics();
    graphics.beginFill(0x303443);
    const background = graphics.drawRect(
      0,
      0,
      this.dims.width,
      this.dims.height
    );

    const titleText = this.createGameNameText();

    const button = new MenuButton(
      "Start Game",
      this.dims.width / 2,
      this.dims.height / 12,
      this.dims.width / 25,
      () => {
        console.log("clicked");
        this.context.setContext("ActiveGame");
        // this.container.renderable = false;
      }
    );

    const buttonRender = button.render();
    buttonRender.x = this.dims.width / 50;
    buttonRender.y = this.dims.height / 10;

    this.container.addChild(background, titleText, buttonRender);
    return this.container;
  }

  render() {
    return this.container;
  }

  destroy() {
    const ctx = this.app.stage.getChildByName("MainMenu");
    if (ctx) {
      console.log("destroying main menu");
      this.app.stage.removeChild(ctx);
    } else {
      console.log("could not find main menu");
    }
  }

  createGameNameText() {
    const container = new Container();

    const text = new Text("Color Tiles 2", {
      fontSize: this.dims.width / 20,
    });

    container.addChild(text);
    container.x = this.dims.width / 50;
    // container.scale.set(0.05);
    return container;
  }
}
