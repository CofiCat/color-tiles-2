import type { Application } from "pixi.js";
import MainMenu from "../Components/UI/Pages/MainMenu/MainMenu";
import ClassicMode from "../Components/UI/Pages/ClassicMode";
import type Renderer from "./Renderer";
import GameOver from "../Components/UI/GameOver/GameOver";

export type Context =
  | "MainMenu"
  | "ClassicMode"
  | "PauseMenu"
  | "GameOver"
  | null;

export default class ContextManager {
  context: Context;
  app: Application;
  mainMenu: MainMenu;
  classicMode: ClassicMode;
  renderer: Renderer;
  gameOver: GameOver;
  constructor(app: Application, renderer: Renderer) {
    this.app = app;
    this.renderer = renderer;
    this.context = null;
    this.mainMenu = this.initMainMenu();
    this.classicMode = this.initActiveGame();
    this.gameOver = this.initGameOver(0);
    this.setContext("MainMenu");
  }

  setContext(newContext: Context) {
    if (this.context === newContext) return;
    this.context = newContext;

    if (this.context === "MainMenu") {
      this.mainMenu = this.initMainMenu();
      this.app.stage.addChild(this.mainMenu.render());
    }
    if (this.context === "ClassicMode") {
      this.classicMode.destroy();
      this.mainMenu.destroy();
      this.gameOver.destroy();
      this.classicMode = new ClassicMode(this.app, this.renderer, this);
      this.app.stage.addChild(this.classicMode.render());
    }
    if (this.context === "GameOver") {
      this.gameOver = this.initGameOver(this.classicMode.getScore());
      this.app.stage.addChild(this.gameOver.render());
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

  private initActiveGame() {
    return new ClassicMode(this.app, this.renderer, this);
  }

  private initGameOver(score: number) {
    const gameOver = new GameOver(
      score,
      {
        width: this.app.view.width,
        height: this.app.view.height,
      },
      this.app,
      this
    );
    return gameOver;
  }

  getContext() {
    return this.context;
  }
  private destoryMainMenu() {}

  private initPauseMenu() {}

  private destroyPauseMenu() {}
}
