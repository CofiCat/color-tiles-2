import type { Application } from "pixi.js";
import MainMenu from "../Components/UI/Pages/MainMenu/MainMenu";

export type Context = "MainMenu" | "ActiveGame" | "PauseMenu" | "GameOver";

export default class ContextManager {
  context: Context;
  app: Application;
  constructor(app: Application) {
    this.app = app;
    this.context = "MainMenu";
    this.initMainMenu();
  }

  setContext(newContext: Context) {
    if (this.context === newContext) return;
    const mainMenu = this.app.stage.getChildByName("MainMenu");
    const activeGame = this.app.stage.getChildByName("ActiveGame");
    const pauseMenu = this.app.stage.getChildByName("PauseMenu");
    const gameOver = this.app.stage.getChildByName("GameOver");

    if (this.context === "MainMenu") {
      if (activeGame) {
        this.app.stage.removeChild(activeGame);
      }
      if (pauseMenu) {
        this.app.stage.removeChild(pauseMenu);
      }
      if (gameOver) {
        this.app.stage.removeChild(gameOver);
      }

      this.initMainMenu();
    }
  }

  private initMainMenu() {
    const mainMenu = new MainMenu(
      {
        width: this.app.view.width,
        height: this.app.view.height,
      },
      this.setContext
    );
    console.log("rendering main menu");
    this.app.stage.addChild(mainMenu.render());
  }

  private destoryMainMenu() {}

  private initPauseMenu() {}

  private destroyPauseMenu() {}
}
