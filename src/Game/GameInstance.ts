import { Application, Container, Graphics } from "pixi.js";
import Mouse from "./Components/UI/Mouse/Mouse";
import Renderer from "./Systems/Renderer";
import ContextManager from "./Systems/ContextManager";

const baseUrl = import.meta.env.BASE_URL;

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

    this.initMusic();
  }

  createApp() {
    const parent = document.getElementById(this.domParentId);
    if (!parent) throw new Error("failed to get parent element");

    const app = new Application<HTMLCanvasElement>({
      background: "#1099bb",
      resizeTo: window,
    });

    document.body.appendChild(app.view);
    return app;
    // if (window.innerWidth < 1200) {
    //   console.log("creating mobile version");
    //   app = this.createMobile(parent);
    // } else {
    //   console.log("creating desktop version");
    //   app = this.createDesktop(parent);
    // }
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
      .beginFill(0xff99ff)
      .drawRect(0, 0, this.app.screen.width, this.app.screen.height);
    background.eventMode = "dynamic";

    this.app.stage.addChild(background, mouse.render());
    return { mouse, background };
  }

  initMusic() {
    const undergroundMusic = new Howl({
      src: [`${baseUrl}/sounds/music/underground.wav`],
      loop: true,
    });
    // Play the sound.
    undergroundMusic.play();
    // nightMusic.play();
    // Change global volume.
    Howler.volume(1);
  }

  createMobile(parent: HTMLElement) {
    const aspectRatio = 20 / 15;
    const widthInset = 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    parent.style.border = "none";
    parent.style.borderRadius = "0px";
    parent.style.width = `${height > width ? height : width}px`;
    parent.style.height = `${height < width ? height : width}px`;
    // parent.style.maxWidth = `${window.innerHeight}px`;
    // parent.style.maxHeight = `${Math.min(window.innerWidth, height)}px`;

    const app = new Application<HTMLCanvasElement>({
      background: "ffffff",
      antialias: true,
      resizeTo: parent,

      width: width,
      height: height,
    });
    app.renderer.events.cursorStyles.default = "none";

    parent.appendChild(app.view);
    window.addEventListener("resize", () => {
      console.log("resized");
      // parent.style.width = `${window.innerWidth / widthInset}px`;
      // parent.style.height = `${window.innerWidth / aspectRatio / widthInset}px`;
      // app.resize();
    });

    return app;
  }
  createDesktop(parent: HTMLElement) {
    const aspectRatio = 20 / 15;
    const widthInset = 1;
    const width = Math.min(window.innerHeight, window.innerWidth / widthInset);
    const height = width / aspectRatio;
    parent.style.width = `${width}px`;
    parent.style.height = `${height}px`;
    parent.style.maxWidth = `${window.innerHeight}px`;
    parent.style.maxHeight = `${Math.min(window.innerWidth, height)}px`;

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
      // parent.style.width = `${window.innerWidth / widthInset}px`;
      // parent.style.height = `${window.innerWidth / aspectRatio / widthInset}px`;
      // app.resize();
    });

    return app;
  }

  createBody() {}
}
