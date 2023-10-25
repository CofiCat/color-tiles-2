import { Container, DisplayObject, Graphics, Text } from "pixi.js";
import MenuButton from "../../Buttons/MenuButton";

export default class MainMenu {
  width: number;
  height: number;
  container: Container;
  gameContainer: Container;
  constructor(
    width: number,
    height: number,
    gameContainer: Container<DisplayObject>
  ) {
    this.container = new Container();
    this.height = height;
    this.width = width;
    this.gameContainer = gameContainer;
  }

  init() {
    this.container.eventMode = "dynamic";
    const graphics = new Graphics();
    graphics.beginFill(0x303443);
    const background = graphics.drawRect(0, 0, this.width, this.height);

    const titleText = this.createGameNameText();

    const button = new MenuButton("Start Game", 500, 70, () => {
      console.log("clicked");
      this.container.renderable = false;
      this.gameContainer.renderable = true;
    });

    const buttonRender = button.render();
    buttonRender.x = 100;
    buttonRender.y = 400;

    this.container.addChild(background, titleText, buttonRender);
    return this.container;
  }

  render() {
    return this.container;
  }

  createGameNameText() {
    const container = new Container();

    const text = new Text("Color Tiles 2", {
      fontSize: 32,
    });

    container.addChild(text);
    // container.scale.set(0.05);
    return container;
  }
}
