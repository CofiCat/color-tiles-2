event.preventDefault()
this.handleTileClick();
if (!gameOver) {
  checkClear(x, y);
  console.log(getCount())
}