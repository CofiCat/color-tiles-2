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
    const padding = 20;
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

    const classic = new MenuButton(
      "Classic Mode",
      this.dims.width / 2,
      this.dims.height / 12,
      this.dims.width / 25,
      () => {
        this.context.setContext("ClassicMode");
        // this.container.renderable = false;
      }
    );

    const endless = new MenuButton(
      "Endless Mode",
      this.dims.width / 2,
      this.dims.height / 12,
      this.dims.width / 25,
      () => {
        this.context.setContext("EndlessMode");
        // this.container.renderable = false;
      }
    );

    const classicButton = classic.render();
    classicButton.x = this.dims.width / 50;
    classicButton.y = this.dims.height / 10;

    const endlessButton = endless.render();
    endlessButton.x = classicButton.x;
    endlessButton.y = classicButton.y + endlessButton.height + padding;

    this.container.addChild(
      background,
      titleText,
      classicButton,
      endlessButton
    );
    return this.container;
  }

  render() {
    return this.container;
  }

  destroy() {
    this.container.destroy({
      children: true,
      texture: true,
    });
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
