import { Application, Container, Graphics } from "pixi.js";
import Mouse from "./Components/UI/Mouse/Mouse";
import Renderer from "./Systems/Renderer";
import ContextManager from "./Systems/ContextManager";
export default class GameInstance {
  domParentId: string;
  app: Application<HTMLCanvasElement>;
  globals: { mouse: Mouse; background: Graphics };
  renderer: Renderer;
  contextManager: ContextManager;
  constructor(domParentId: string) {
    this.domParentId = domParentId;
    this.app = this.createApp();
    this.renderer = new Renderer(this.app);

    this.globals = this.initGlobals();
    this.contextManager = new ContextManager(this.app);
  }

  createApp() {
    const parent = document.getElementById(this.domParentId);
    if (!parent) throw new Error("failed to get parent element");

    const app = new Application<HTMLCanvasElement>({
      background: "ffffff",
      antialias: true,
      resizeTo: parent,
      // width: dims.width,
      // height: dims.height,
    });
    app.renderer.events.cursorStyles.default = "none";
    parent.appendChild(app.view);
    return app;
  }

  /**
   * Globals are things that should always exist in the app regardless of context
   * @returns mouse object, background graphic
   */
  initGlobals() {
    const mouse = new Mouse(this.app.stage);
    // this.renderer.addUpdatable(mouse);

    const background = new Graphics()
      .beginFill(0x111111)
      .drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.eventMode = "dynamic";

    this.app.stage.addChild(background, mouse.render());
    return { mouse, background };
  }
}
