import { Container, Graphics, Text } from "pixi.js";
import SoundManager from "../../../Systems/SoundManager";

export default class MenuButton {
  width: number;
  height: number;
  fontSize: number;
  private text: string;
  private container: Container;
  private onClick: Function;
  soundManager: SoundManager;
  constructor(
    text: string,
    width: number,
    height: number,
    fontSize: number,
    onClick: Function
  ) {
    this.text = text;
    this.onClick = onClick;
    this.width = width;
    this.height = height;
    this.fontSize = fontSize;
    this.container = new Container();
    this.soundManager = new SoundManager();
    this.init();
  }

  init() {
    const graphics = new Graphics();
    this.container.eventMode = "dynamic";
    this.container.onpointertap = () => {
      this.soundManager.effects.tap();
      this.onClick();
    };
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
      fontSize: this.fontSize,
    });

    text.x = this.width / 2 - text.width / 2;
    text.y = this.height / 2 - text.height / 2;
    this.container.addChild(border, inner, text);
  }

  render() {
    return this.container;
  }
}
