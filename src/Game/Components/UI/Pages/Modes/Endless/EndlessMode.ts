import { Application, Container } from "pixi.js";
import ClassicLogicController from "../Classic/ClassicController";
import Score from "../../../Score/Score";
import TimerBar from "../../../../TimerBar/TimerBar";
import type { Dimensions } from "../../../../../types/2d.utils";
import Board from "../../../../Board/Board";
import type Renderer from "../../../../../Systems/Renderer";
import type ContextManager from "../../../../../Systems/ContextManager";
import AttackIndicator from "../../../../AttackIndicator/AttackIndicator";
import EndlessLogicController from "./EndlessController";

const theme = {
  light: { primary: 0xeeeeee, secondary: 0xdddddd },
  dark: { primary: 0x282828, secondary: 0x2f2f2f },
  day: { primary: 0x9adfc3, secondary: 0x92d9be },
  night: { primary: 0x013663, secondary: 0x003059 },
  night2: { primary: 0x013663, secondary: 0x002d53 },
};

const curTheme = theme.night;

export default class EndlessMode {
  container: Container;
  app: Application;
  logicController: EndlessLogicController;
  score: Score;
  timer: TimerBar;
  sceneDims: Dimensions;
  boardDims: Dimensions;
  board: Board;
  renderer: Renderer;
  context: ContextManager;
  world: Container;
  aimAssist: AttackIndicator;
  worldScale: number;
  constructor(app: Application, renderer: Renderer, context: ContextManager) {
    this.context = context;
    this.renderer = renderer;
    this.container = new Container();
    this.app = app;
    this.world = new Container();
    this.sceneDims = {
      width: this.app.view.width,
      height: this.app.view.height,
    };
    this.boardDims = { width: 20, height: 14 };
    this.worldScale = this.app.screen.width / this.boardDims.width;
    this.score = new Score(this.app);
    this.timer = new TimerBar(
      6000,
      this.sceneDims.width * 0.8,
      this.sceneDims.height / 10 / 2
    );
    this.logicController = new EndlessLogicController(
      this.boardDims,
      1,
      this.score,
      this.timer,
      this.context
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
    this.aimAssist = new AttackIndicator(
      1,
      this.world,
      this.worldScale,
      this.logicController.boardData
    );

    this.init();
  }

  init() {
    this.container.name = "ActiveGame";
    this.setupScene();
  }

  setupScene() {
    const UI = new Container();

    // UI.scale.set(1);
    this.world.scale.set(this.worldScale);

    UI.addChild(this.timer.render(), this.score.init());
    this.world.addChild(
      this.board.render(),
      this.logicController.generateTiles(),
      this.aimAssist.render()
    );

    this.container.addChild(this.world, UI);

    // fix timer to bottom
    this.timer.render().y =
      this.world.height +
      this.timer.render().height / 1.25 -
      (this.sceneDims.height - this.world.height) / 2;
    this.timer.render().x = this.sceneDims.width / 30;

    // fix score to right of timer
    this.score.render().y =
      this.timer.render().y + this.score.render().height / 4;

    this.score.getContainer().x =
      this.timer.render().x + this.timer.render().width + 10;

    this.renderer.addUpdatable(this.logicController, this.score, this.timer);
  }

  destroy() {
    // const ctx = this.app.stage.getChildByName("ActiveGame");
    this.container.destroy({
      children: true,
      texture: true,
      baseTexture: true,
    });

    this.renderer.popUpdatable();
    this.renderer.popUpdatable();
    this.renderer.popUpdatable();
    // if (ctx) {
    //   this.app.stage.removeChild(ctx);
    // }
  }

  getScore() {
    return this.score.getScore();
  }

  render() {
    return this.container;
  }
}
