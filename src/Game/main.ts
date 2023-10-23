//---
import * as PIXI from "pixi.js"
import Board from "./Components/Board/Board"
import Logic from "./Systems/Logic";
import { Howl, Howler } from 'howler';
import { mouseCoordinatesToTileIndex } from "./Systems/util";
import AttackIndicator from "./Components/AttackIndicator/AttackIndicator";
//---


const height = 15, width = 23;
const tileWidth = window.innerWidth / 1.2 / width;

const app = new PIXI.Application<HTMLCanvasElement>({
  background: "ffffff",
  antialias: true,
  // resizeTo: window,
  width: width * tileWidth,
  height: height * tileWidth,
  resolution: window.devicePixelRatio,

})

app.renderer.plugins.interaction.cursorStyles.default = 'none'

const undoButton = document.getElementById('undo');
if (!undoButton) throw new Error('null undo button')
const htmlContainer = document.getElementById('game-container');
htmlContainer?.appendChild(app.view);

// app.stage.scale.set(window.innerWidth / 1920);




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
// undergroundMusic.play();
nightMusic.play()
// Change global volume.
Howler.volume(.2);

//init GAME LOGIC
const logic = new Logic(height, width, tileWidth);

//init BOARD
const board = new Board(height, width, tileWidth, (x: number, y: number) => {
  logic.checkClear(x, y)
}, curTheme.primary, curTheme.secondary);

//init ATTACK INDICATOR
const attackIndicator = new AttackIndicator(tileWidth, logic.boardData);

const tiles = logic.generateTiles();
const grid = board.createGrid();

undoButton.onclick = () => logic.undo(app.stage)

app.stage.addChild(grid, tiles);
app.stage.addChild(...attackIndicator.render());

let mousePos = { x: 0, y: 0 }
app.stage.onmousemove = ((event) => {
  mousePos.x = event.screenX
  mousePos.y = event.screenY
})
app.ticker.add(() => {
  console.log("ticking")
  attackIndicator.update(mousePos)

}
);
app.ticker.start();

// const animate = (time: number) => {
//   app.ticker.update(time);
// }