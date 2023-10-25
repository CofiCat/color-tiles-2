//---
import * as PIXI from "pixi.js";
import Board from "./Components/Board/Board";
import Logic from "./Systems/Logic";
import { Howl, Howler } from "howler";
import { mouseCoordinatesToTileIndex } from "./Systems/util";
import AttackIndicator from "./Components/AttackIndicator/AttackIndicator";
import TimerBar from "./Components/TimerBar/TimerBar";
import Score from "./Components/Score/Score";
import MainMenu from "./Components/UI/Pages/MainMenu/MainMenu";
import Mouse from "./Components/UI/Mouse/Mouse";
import Block from "./Components/Block/Block";
import BlockManifest from "./Components/Block/blockManifest";
//---

const height = 15,
  width = 23;
const tileWidth = 1;
const scale = 80;
const rendererWidth = width * tileWidth * scale;
const rendererHeight = height * tileWidth * scale;

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "ffffff",
  antialias: true,
  // resizeTo: window,
  width: rendererWidth,
  height: rendererHeight,
  resolution: window.devicePixelRatio,
});

// app.renderer.events.cursorStyles.default = "none";

const undoButton = document.getElementById("undo")!;
const htmlContainer = document.getElementById("game")!;
htmlContainer.appendChild(app.view);

// app.stage.scale.set(1);

const theme = {
  light: { primary: 0xeeeeee, secondary: 0xdddddd },
  dark: { primary: 0x282828, secondary: 0x2f2f2f },
  day: { primary: 0x9adfc3, secondary: 0x92d9be },
  night: { primary: 0x013663, secondary: 0x003059 },
  night2: { primary: 0x013663, secondary: 0x002d53 },
};

const curTheme = theme.night;

// Setup the new Howl.
const nightMusic = new Howl({
  src: ["/sounds/music/nightMusic.wav"],
  loop: true,
  volume: 0.6,
});
const undergroundMusic = new Howl({
  src: ["/sounds/music/underground.wav"],
  loop: true,
});

// Play the sound.
// undergroundMusic.play();
nightMusic.play();
// Change global volume.
Howler.volume(0);

// init Score
const score = new Score();

//init Timer Bar
const timerBar = new TimerBar(60 * 60 * 4, 10);

//init GAME LOGIC
const logic = new Logic(height, width, tileWidth, score, timerBar);

//init BOARD
const board = new Board(
  height,
  width,
  tileWidth,
  (x: number, y: number) => {
    logic.checkClear(x, y);
  },
  curTheme.primary,
  curTheme.secondary
);

//init ATTACK INDICATOR
const attackIndicator = new AttackIndicator(tileWidth, logic.boardData);

//init Mouse
const mouse = new Mouse();
const tiles = logic.generateTiles();
const grid = board.createGrid();

undoButton.onclick = () => logic.undo(app.stage);

const world = new PIXI.Container();

const menu = new MainMenu(rendererWidth, rendererHeight, world);

world.scale.set(scale);

//STAGE
world.addChild(grid, tiles);
world.renderable = false;
world.addChild(...attackIndicator.render());
app.stage.addChild(score.init());
app.stage.addChild(timerBar.init());
app.stage.addChild(world);
app.stage.addChild(menu.init());

app.stage.addChild(mouse.render());

timerBar.getContainer().y = height;
score.getContainer().y = height;
score.getContainer().x = timerBar.getContainer().x + 10;
logic.addTickers([timerBar, score]);

let rescaledMousePos = { x: 0, y: 0 };
let mousePos = { x: 0, y: 0 };

app.stage.onmousemove = (event) => {
  mousePos.x = event.screenX;
  mousePos.y = event.screenY;
  rescaledMousePos.x = (event.screenX / rendererWidth) * width;
  rescaledMousePos.y = (event.screenY / rendererHeight) * height;
};

app.ticker.add(() => {
  logic.tick();
  attackIndicator.update(rescaledMousePos);
  mouse.update(mousePos);
});

app.ticker.start();
