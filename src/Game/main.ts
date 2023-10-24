//---
import * as PIXI from "pixi.js"
import Board from "./Components/Board/Board"
import Logic from "./Systems/Logic";
import { Howl, Howler } from 'howler';
import { mouseCoordinatesToTileIndex } from "./Systems/util";
import AttackIndicator from "./Components/AttackIndicator/AttackIndicator";
import TimerBar from "./Components/TimerBar/TimerBar";
//---


const height = 15, width = 23;
const tileWidth = 1;
const scale = 100;
const app = new PIXI.Application<HTMLCanvasElement>({
  background: "ffffff",
  antialias: true,
  // resizeTo: window,
  width: width * tileWidth * scale,
  height: height * tileWidth * scale,
  resolution: window.devicePixelRatio,

})

// app.renderer.events.cursorStyles.default = 'none'

const undoButton = document.getElementById('undo');
if (!undoButton) throw new Error('null undo button')
const htmlContainer = document.getElementById('game-container');
htmlContainer?.appendChild(app.view);

app.stage.scale.set(100);

const theme = {
  normal: { primary: 0xeeeeee, secondary: 0xdddddd },
  day: { primary: 0x9adfc3, secondary: 0x92d9be },
  night: { primary: 0x013663, secondary: 0x003059 },
  night2: { primary: 0x013663, secondary: 0x002d53 }
}
const curTheme = theme.night2


// Setup the new Howl.
const nightMusic = new Howl({
  src: ['/sounds/music/nightMusic.wav'],
  loop: true,
  volume: .6
});
const undergroundMusic = new Howl({
  src: ['/sounds/music/underground.wav'],
  loop: true
});


// Play the sound.
undergroundMusic.play();
// nightMusic.play()
// Change global volume.
Howler.volume(0);

//init GAME LOGIC
const logic = new Logic(height, width, tileWidth);

//init BOARD
const board = new Board(height, width, tileWidth, (x: number, y: number) => {
  logic.checkClear(x, y)
}, curTheme.primary, curTheme.secondary);

//init ATTACK INDICATOR
const attackIndicator = new AttackIndicator(tileWidth, logic.boardData);

//init Timer Bar
const timerBar = new TimerBar(10000);

const tiles = logic.generateTiles();
const grid = board.createGrid();

undoButton.onclick = () => logic.undo(app.stage)

app.stage.addChild(grid, tiles);
app.stage.addChild(...attackIndicator.render());
// app.stage.addChild(timerBar.render());


console.log(logic.getBlockCount())

let mousePos = { x: 0, y: 0 }

app.stage.onmousemove = ((event) => {

  mousePos.x = event.screenX / app.stage.width * width
  mousePos.y = event.screenY / app.stage.height * height
  console.log(mousePos);
  console.log(app.stage.height, height);
})

app.ticker.add(() => {
  // console.log(mousePos);
  logic.tick();
  attackIndicator.update(mousePos)
}
);
app.ticker.start();

// const animate = (time: number) => {
//   app.ticker.update(time);
// }