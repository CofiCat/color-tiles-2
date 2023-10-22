

// OLD METHODS


// // PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;



// const score = document.getElementById('score')
// const progressTimer = document.getElementById('progress-timer') as HTMLProgressElement;
// const container = document.getElementById('game-container');
// if (!container) { throw new Error("null container") }




// progressTimer.max = 2000;
// progressTimer.value = 2000;
// window.setInterval(() => {
//   progressTimer.value -= 10;
//   if (progressTimer.value <= 0) {
//     gameOver = true;
//   }
// }, 1000)


// const height = 15;
// const width = 23;

// let test;

// // const gBoard = new Board(height, width, tileWidth, () => { console.log("clicked") }, );
// // addTiles()











// function checkClear(x: number, y: number) {
//   const down = getDown(x, y);
//   const up = getUp(x, y);
//   const left = getLeft(x, y);
//   const right = getRight(x, y);

//   const dirs = [left, right, up, down];

//   const clears = new Set();
//   dirs.forEach((val1, i) => {
//     dirs.forEach((val2, j) => {
//       if (i != j) {
//         if (val1?.tileData?.color === val2?.tileData?.color && val1 != null) {
//           clears.add(val1);
//           clears.add(val2);
//         }
//       }
//     })
//   })
//   clears.forEach((val: typeof board[number][number]) => {
//     increaseScore()
//     console.log('sprite ref', val.spriteRef)
//     clearBlockAnimation(val.spriteRef)
//     // app.stage.removeChild(val.spriteRef);
//     board[val.tileData.coords.y][val.tileData.coords.x] = null;
//   })
//   if (clears.size === 0) {
//     progressTimer.value -= 200;
//   }
// }




// const increaseScore = () => {
//   if (!score) return;
//   score.textContent = (Number(score.textContent) + 1).toString()
// }


