import type { Application } from "pixi.js";
import MainMenu from "../Components/UI/Pages/MainMenu/MainMenu";
import ClassicMode from "../Components/UI/Pages/Modes/Classic/ClassicMode";
import type Renderer from "./Renderer";
import GameOver from "../Components/UI/GameOver/GameOver";
import EndlessMode from "../Components/UI/Pages/Modes/Endless/EndlessMode";

export type Context =
  | null
  | "MainMenu"
  | "ClassicMode"
  | "EndlessMode"
  | "PauseMenu"
  | "GameOver";

type ContextData = {
  score?: number;
};

export default class ContextManager {
  context: Context;
  app: Application;
  mainMenu: MainMenu;
  classicMode: ClassicMode | null;
  endlessMode: EndlessMode | null;
  renderer: Renderer;
  gameOver: GameOver | null;
  prevContext: Context;
  data: ContextData | null;
  constructor(app: Application, renderer: Renderer) {
    this.app = app;
    this.renderer = renderer;
    this.context = null;
    this.mainMenu = this.initMainMenu();
    this.classicMode = null;
    this.gameOver = null;
    this.endlessMode = null;
    this.prevContext = this.context;
    this.data = null;
    // this.endlessMode = this.
    this.setContext("MainMenu");
  }

  setContext(newContext: Context) {
    if (this.context === newContext) return;
    this.prevContext = this.context;
    this.context = newContext;

    if (newContext != "GameOver") {
      this.destroyAllContext();
    }
    if (this.context === "MainMenu") {
      this.mainMenu = this.initMainMenu();
      this.app.stage.addChild(this.mainMenu.render());
    }
    if (this.context === "ClassicMode") {
      this.classicMode = new ClassicMode(this.app, this.renderer, this);
      this.app.stage.addChild(this.classicMode.render());
    }
    if (this.context === "EndlessMode") {
      this.endlessMode = new EndlessMode(this.app, this.renderer, this);
      this.app.stage.addChild(this.endlessMode.render());
    }
    if (this.context === "GameOver") {
      this.gameOver = this.initGameOver(this.data?.score ?? 0);
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

  private destroyAllModes() {
    this.classicMode?.destroy();
    this.endlessMode?.destroy();
  }

  private destroyAllContext() {
    this.destroyAllModes();
    this.mainMenu?.destroy();
    this.gameOver?.destroy();
  }
  private destoryMainMenu() {}

  private initPauseMenu() {}

  private destroyPauseMenu() {}
}
