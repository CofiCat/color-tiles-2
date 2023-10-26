import type { Application } from "pixi.js";
import MainMenu from "../Components/UI/Pages/MainMenu/MainMenu";
import ActiveGame from "../Components/UI/Pages/ActiveGame";
import type Renderer from "./Renderer";

export type Context =
  | "MainMenu"
  | "ActiveGame"
  | "PauseMenu"
  | "GameOver"
  | null;

export default class ContextManager {
  context: Context;
  app: Application;
  mainMenu: MainMenu;
  activeGame: ActiveGame;
  renderer: Renderer;
  constructor(app: Application, renderer: Renderer) {
    this.app = app;
    this.context = null;
    this.mainMenu = this.initMainMenu();
    this.renderer = renderer;
    this.activeGame = new ActiveGame(this.app, this.renderer);
    this.renderer = renderer;
    this.setContext("MainMenu");
  }
  setContext(newContext: Context) {
    console.log(this.app);
    if (this.context === newContext) return;
    this.context = newContext;
    if (this.context === "MainMenu") {
      this.mainMenu = this.initMainMenu();
      this.app.stage.addChild(this.mainMenu.render());
    }
    if (this.context === "ActiveGame") {
      this.mainMenu.destroy();
      this.activeGame = new ActiveGame(this.app, this.renderer);
      this.app.stage.addChild(this.activeGame.render());
      console.log(this.app.stage);
      console.log("rendering active game");
    }
  }

  private initMainMenu() {
    const mainMenu = new MainMenu(
      {
        width: this.app.view.width,
        height: this.app.view.height,
      },
      this.app,
      this
    );
    return mainMenu;
  }

  private destoryMainMenu() {}

  private initPauseMenu() {}

  private destroyPauseMenu() {}
}
