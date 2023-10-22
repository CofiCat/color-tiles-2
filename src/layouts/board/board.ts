//---
import * as PIXI from "pixi.js"
import { tiles } from "./tileManifest";
//---

// PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

const app = new PIXI.Application({
  background: "ffffff",
  antialias: true,
  resizeTo: window,
  resolution: window.devicePixelRatio
})

const score = document.getElementById('score')
const progressTimer = document.getElementById('progress-timer') as HTMLProgressElement;
const container = document.getElementById('game-container');
if (!container) { throw new Error("null container") }

let gameOver = false;

container.appendChild(app.view)


progressTimer.max = 2000;
progressTimer.value = 2000;
window.setInterval(() => {
  progressTimer.value -= 10;
  if (progressTimer.value <= 0) {
    gameOver = true;
  }
}, 1000)


const height = 15;
const width = 23;
const tileNames: Array<string> = ["red", "orange", "blue", "purple", "pink", "green"];

let test;

let board = new Array(height).fill(null).map(() => new Array(width).fill(null));
const tileWidth = 100;
app.stage.scale.set(.75);

createGrid()
addTiles()

console.log(getCount());

function getCount() {
  let count = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j] != null) count++
    }
  }
  return count;
}
function createGrid() {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const graphics = new PIXI.Graphics()
      if ((x + y) % 2 === 1) graphics.beginFill(0xeeeeee)
      else graphics.beginFill(0xdddddd);

      const rect = graphics.drawRect(x * tileWidth, y * tileWidth, tileWidth, tileWidth)
      rect.eventMode = "dynamic"
      rect.onpointerdown = (event) => {
        event.preventDefault()

        if (!gameOver) {
          checkClear(x, y);
          console.log(getCount())
        }
      }
      app.stage.addChild(rect)
    }
  }
}

function addTiles() {
  const numPairs = 100;
  for (let i = 0; i < numPairs; i++) {

    const tileData = tiles[i % tiles.length];
    const randomPair = genRandomPair();
    createTile(randomPair[0].x, randomPair[0].y, tileData);
    createTile(randomPair[1].x, randomPair[1].y, tileData);
  }
}

function createTile(x: number, y: number, data: typeof tiles[0]) {
  const tile = PIXI.Sprite.from(data.path);
  app.stage.addChild(tile);

  tile.x = x * tileWidth;
  tile.y = y * tileWidth;
  tile.eventMode = "static"
  // tile.scale.set(data.scale);
  tile.width = tileWidth;
  tile.height = tileWidth;

  board[y][x] = {
    tileData: {
      ...data, coords: {
        x, y
      }
    }, spriteRef: tile
  };
}



function checkClear(x: number, y: number) {
  const down = getDown(x, y);
  const up = getUp(x, y);
  const left = getLeft(x, y);
  const right = getRight(x, y);

  const dirs = [left, right, up, down];

  const clears = new Set();
  dirs.forEach((val1, i) => {
    dirs.forEach((val2, j) => {
      if (i != j) {
        if (val1?.tileData?.color === val2?.tileData?.color && val1 != null) {
          clears.add(val1);
          clears.add(val2);
        }
      }
    })
  })
  clears.forEach((val: typeof board[number][number]) => {
    increaseScore()
    console.log('sprite ref', val.spriteRef)
    clearBlockAnimation(val.spriteRef)
    // app.stage.removeChild(val.spriteRef);
    board[val.tileData.coords.y][val.tileData.coords.x] = null;
  })
  if (clears.size === 0) {
    progressTimer.value -= 200;
  }
}


const getLeft = (x: number, y: number) => {
  while (board[y][x] == null && x > 0) {
    x--;
  }
  return board[y][x]
}
const getRight = (x: number, y: number) => {
  while (board[y][x] == null && x < width - 1) {
    x++;
  }
  return board[y][x]
}
const getUp = (x: number, y: number) => {
  while (board[y][x] == null && y > 0) {
    y--;
  }
  return board[y][x]
}
const getDown = (x: number, y: number) => {
  while (board[y][x] == null && y < height - 1) {
    y++;
  }
  return board[y][x]
}

const increaseScore = () => {
  if (!score) return;
  score.textContent = (Number(score.textContent) + 1).toString()
}

function genRandomPair() {
  let c1 = { x: Math.floor(Math.random() * (width)), y: Math.floor(Math.random() * (height)) };
  let c2 = { x: Math.floor(Math.random() * (width)), y: Math.floor(Math.random() * (height)) };
  while (board[c1.y][c1.x] != null) {
    c1 = { x: Math.floor(Math.random() * (width)), y: Math.floor(Math.random() * (height)) };
  }
  while (board[c2.y][c2.x] != null) {
    c2 = { x: Math.floor(Math.random() * (width)), y: Math.floor(Math.random() * (height)) };
  }
  return [c1, c2]
}

function clearBlockAnimation(spriteRef: PIXI.Sprite) {

  const velocity = { x: 10, y: -10 }
  const acceleration = { x: 0, y: 0 }
  const gravity = 4;
  const anim = window.setInterval((xDir: number) => {
    spriteRef.x += velocity.x * xDir;
    spriteRef.y += velocity.y
    velocity.y += acceleration.y + gravity;
    velocity.x += acceleration.x
    spriteRef.rotation += xDir / 100;
    console.log(xDir);
  }, 1000 / 50, Math.random() * 10 - 5)

  window.setTimeout(() => {
    window.clearInterval(anim)
    app.stage.removeChild(spriteRef);
  }, 500)
}