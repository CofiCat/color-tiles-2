import { Application, Container, Graphics } from "pixi.js";
import Mouse from "./Components/UI/Mouse/Mouse";
import Renderer from "./Systems/Renderer";
import ContextManager from "./Systems/ContextManager";
import MainMenu from "./Components/UI/Pages/MainMenu/MainMenu";
export default class GameInstance {
  domParentId: string;
  app: Application<HTMLCanvasElement>;
  globals: { mouse: Mouse; background: Graphics };
  renderer: Renderer;
  contextManager: ContextManager;
  constructor(domParentId: string) {
    this.domParentId = domParentId;
    this.app = this.createApp();
    this.app.stage.sortableChildren = true;
    this.renderer = new Renderer(this.app);

    this.globals = this.initGlobals();
    this.contextManager = new ContextManager(this.app, this.renderer);

    this.app.stage.sortChildren();
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
    window.addEventListener("resize", () => {
      console.log("resized");
      app.resize();
    });
    return app;
  }

  /**
   * Globals are things that should always exist in the app regardless of context
   * @returns mouse object, background graphic
   */
  initGlobals() {
    const mouse = new Mouse(this.app.stage);
    // this.renderer.addUpdatable(mouse);
    mouse.render().zIndex = 1000;
    const background = new Graphics()
      .beginFill(0x111111)
      .drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.eventMode = "dynamic";

    this.app.stage.addChild(background, mouse.render());
    return { mouse, background };
  }

  initContext() {}
}
