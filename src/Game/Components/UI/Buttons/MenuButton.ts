import { Container, Graphics, Text } from "pixi.js";

export default class MenuButton {
  private container: Container;
  private text: string;
  private onClick: Function;
  width: number;
  height: number;
  constructor(text: string, width: number, height: number, onClick: Function) {
    this.text = text;
    this.onClick = onClick;
    this.container = new Container();
    this.width = width;
    this.height = height;
    this.init();
  }

  init() {
    const graphics = new Graphics();
    this.container.eventMode = "dynamic";
    this.container.onclick = () => this.onClick();
    const borderRadius = 20;

    graphics.beginFill(0x111111);
    const border = graphics.drawRoundedRect(
      0,
      0,
      this.width,
      this.height,
      borderRadius
    );
    graphics.beginFill(0x555555);
    const inner = graphics.drawRoundedRect(
      2.5,
      2.5,
      this.width - 5,
      this.height - 5,
      borderRadius
    );

    // inner.x = this.width / 2 - inner.width / 2;
    // inner.y = this.height / 2 - inner.height / 2;

    const text = new Text(this.text, {
      fontSize: 50,
    });

    text.x = this.width / 2 - text.width / 2;
    text.y = this.height / 2 - text.height / 2;
    this.container.addChild(border, inner, text);
  }

  render() {
    return this.container;
  }
}
