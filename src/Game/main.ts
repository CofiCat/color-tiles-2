//---
import * as PIXI from "pixi.js"
import Board from "./Components/Board/Board"
import Logic from "./Systems/Logic";
import { Howl, Howler } from 'howler';
//---



const app = new PIXI.Application<HTMLCanvasElement>({
  background: "ffffff",
  antialias: true,
  // resizeTo: window,
  width: window.innerWidth - 100,
  height: window.innerHeight - 100,
  resolution: window.devicePixelRatio
})

const undoButton = document.getElementById('undo');
if (!undoButton) throw new Error('null undo button')
const htmlContainer = document.getElementById('game-container');
htmlContainer?.appendChild(app.view);

// app.stage.scale.set(window.innerWidth / 1920);

const height = 15, width = 23;
const tileWidth = window.innerWidth / 1.2 / width;


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
Howler.volume(.2);

const logic = new Logic(height, width, tileWidth);
const board = new Board(height, width, tileWidth, (x: number, y: number) => {
  logic.checkClear(x, y)
}, curTheme.primary, curTheme.secondary);

const tiles = logic.generateTiles();
const grid = board.createGrid();

undoButton.onclick = () => logic.undo(app.stage)

app.stage.addChild(grid, tiles);



const graphics = new PIXI.Graphics()
graphics.beginFill(0xff00ff);
const circle = graphics.drawCircle(0, 0, 20)
app.stage.addChild(circle)

app.stage.onmousemove = ((event) => {
  // console.log(event.screenX, event.screenY)
  circle.x = event.screenX
  circle.y = event.screenY
  console.log(circle.x, circle.y)
  // console.log(event);
})