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
import { clamp } from "./Systems/Mover";
import { calculateAspectRatioFit } from "./Systems/util";
const baseUrl = import.meta.env.BASE_URL;
//---

const borderRadius = 20 * 2;
const height = 15,
  width = 23;
const tileWidth = 1;
const maxWidth = screen.width * 0.7;
const screenRatio = screen.width / (screen.height * 1.1);

console.log(screen.width);
const windowInset = 0.9;
let gameWidth = clamp(
  window.innerWidth * windowInset - borderRadius,
  0,
  maxWidth
);
const gameDimensions = calculateAspectRatioFit(
  window.innerWidth * windowInset + borderRadius,
  (window.innerWidth * windowInset + borderRadius) / screenRatio,
  // window.innerHeight * windowInset + borderRadius,
  Math.min(screen.width * 0.7 - borderRadius, window.innerWidth - borderRadius),
  window.innerHeight * windowInset - borderRadius
);

console.log(gameDimensions);

let gameHeight = gameWidth / screenRatio - borderRadius;
if (gameHeight > window.innerHeight) {
  console.log("to adjust", gameHeight - window.innerHeight);
  // console.log("request resize", window.innerHeight / gameHeight);
  // const rescale = (window.innerHeight * windowInset) / gameHeight;
  // console.log("pre", gameWidth);
  gameWidth -= gameHeight - window.innerHeight - borderRadius;
  // console.log("updated", gameWidth);
  gameHeight -= gameHeight - window.innerHeight - borderRadius;
}
console.log(gameHeight, window.innerHeight);
const xDif = gameWidth / screenRatio;
const scale = gameWidth / 1.2;

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "ffffff",
  antialias: true,
  // resizeTo: window,
  width: gameDimensions.width,
  height: gameDimensions.height,
});

console.log("screen ratio", screenRatio);
console.log(
  "app ratio",
  app.screen.width / app.screen.height,
  "at:",
  app.screen.width,
  app.screen.height
);

app.renderer.events.cursorStyles.default = "none";

// const undoButton = document.getElementById("undo")!;
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
  src: [`${baseUrl}/sounds/music/nightMusic.wav`],
  loop: true,
  volume: 0.6,
});

const undergroundMusic = new Howl({
  src: [`${baseUrl}/sounds/music/underground.wav`],
  loop: true,
});

// Play the sound.
undergroundMusic.play();
// nightMusic.play();
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

// undoButton.onclick = () => logic.undo(app.stage);

const world = new PIXI.Container();
const UI = new PIXI.Container();

const menu = new MainMenu(app.screen.width, app.screen.height, world);

const background = new PIXI.Container();
background.width = app.screen.width;
background.height = app.screen.height;
const graphics = new PIXI.Graphics();
graphics.beginFill(0x111111);
const backdrop = graphics.drawRect(0, 0, app.screen.width, app.screen.height);
backdrop.eventMode = "dynamic";
background.addChild(backdrop);

world.scale.set(scale / 23);
console.log(gameWidth);
const uiScale = gameWidth / screen.width;
console.log(uiScale);
// UI.scale.set(uiScale);
//STAGE
app.stage.addChild(background);
world.addChild(grid, tiles);
world.renderable = false;
world.addChild(...attackIndicator.render());
UI.addChild(score.init());
UI.addChild(timerBar.init());
app.stage.addChild(world);
UI.addChild(menu.init());
app.stage.addChild(UI);

mouse.render().scale.set(app.screen.width / maxWidth);
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
  // rescaledMousePos.x = (event.screenX / rendererWidth) * width;
  // rescaledMousePos.y = (event.screenY / rendererHeight) * height;
};

world.onmousemove = () => {
  console.log("mouse omve in world");
};

app.ticker.add(() => {
  logic.tick();
  attackIndicator.update(rescaledMousePos);
  mouse.update(mousePos);
});

app.ticker.start();
