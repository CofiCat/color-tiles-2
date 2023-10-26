import { Application, Container } from "pixi.js";
import LogicController from "../../../Systems/LogicController";
import Score from "../Score/Score";
import TimerBar from "../../TimerBar/TimerBar";
import type { Dimensions } from "../../../types/2d.utils";
import Board from "../../Board/Board";
import type Renderer from "../../../Systems/Renderer";

const theme = {
  light: { primary: 0xeeeeee, secondary: 0xdddddd },
  dark: { primary: 0x282828, secondary: 0x2f2f2f },
  day: { primary: 0x9adfc3, secondary: 0x92d9be },
  night: { primary: 0x013663, secondary: 0x003059 },
  night2: { primary: 0x013663, secondary: 0x002d53 },
};

const curTheme = theme.night;

export default class ActiveGame {
  container: Container;
  app: Application;
  logicController: LogicController;
  score: Score;
  timer: TimerBar;
  sceneDims: Dimensions;
  boardDims: Dimensions;
  board: Board;
  renderer: Renderer;
  constructor(app: Application, renderer: Renderer) {
    this.renderer = renderer;
    this.container = new Container();
    this.app = app;
    this.sceneDims = {
      width: this.app.view.width,
      height: this.app.view.height,
    };
    this.boardDims = { width: 20, height: 14 };
    this.score = new Score();
    this.timer = new TimerBar(
      10000,
      this.sceneDims.width * 0.8,
      this.sceneDims.height / 10 / 2
    );
    console.log("scene", this.sceneDims);
    this.logicController = new LogicController(
      this.boardDims,
      1,
      this.score,
      this.timer
    );
    this.board = new Board(
      this.boardDims,
      1,
      (x: number, y: number) => {
        this.logicController.checkClear(x, y);
      },
      curTheme.primary,
      curTheme.secondary
    );

    this.init();
  }

  init() {
    this.container.name = "ActiveGame";
    this.setupScene();
  }

  setupScene() {
    const UI = new Container();
    const world = new Container();

    // UI.scale.set(1);
    world.scale.set(this.app.screen.width / this.boardDims.width);

    UI.addChild(this.timer.render(), this.score.init());
    world.addChild(this.board.render(), this.logicController.generateTiles());

    this.container.addChild(world, UI);

    // fix timer to bottom
    this.timer.render().y =
      this.sceneDims.height -
      this.timer.render().height / 2 -
      this.sceneDims.height / 10 / 2;
    this.timer.render().x = this.sceneDims.width / 30;

    // fix score to right of timer
    this.score.getContainer().y =
      this.sceneDims.height -
      this.score.getContainer().height / 2 -
      this.sceneDims.height / 10 / 2;

    this.score.getContainer().x =
      this.timer.render().x + this.timer.render().width + 10;

    this.renderer.addUpdatable(this.score, this.timer, this.logicController);
  }

  destroy() {
    const ctx = this.app.stage.getChildByName("ActiveGame");
    if (ctx) {
      this.app.stage.removeChild(ctx);
    }
  }

  render() {
    return this.container;
  }
}
