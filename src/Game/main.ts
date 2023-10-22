//---
import * as PIXI from "pixi.js"
import Board from "./Components/Board/Board"
import Logic from "./Systems/Logic";
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
  night: { primary: 0x013663, secondary: 0x003059 }
}

const curTheme = theme.night

const logic = new Logic(height, width, tileWidth);
const board = new Board(height, width, tileWidth, (x: number, y: number) => logic.checkClear(x, y), curTheme.primary, curTheme.secondary);

const tiles = logic.generateTiles();
const grid = board.createGrid();

undoButton.onclick = () => logic.undo(app.stage)

app.stage.addChild(grid, tiles);


