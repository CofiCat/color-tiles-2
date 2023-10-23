import type Block from "../Components/Block/Block";

/**
 * tries to randomly generate a pair of random coordinates. If a coordinate spot is already occupied,
 * retries until it finds an available spot 
 * @param board 
 * @returns pair of set of coordinates
 */
export function genRandomPair(board: Array<Array<null | Block>>) {
  let c1 = { x: Math.floor(Math.random() * (board[0].length)), y: Math.floor(Math.random() * (board.length)) };
  let c2 = { x: Math.floor(Math.random() * (board[0].length)), y: Math.floor(Math.random() * (board.length)) };
  while (board[c1.y][c1.x] != null) {
    c1 = { x: Math.floor(Math.random() * (board[0].length)), y: Math.floor(Math.random() * (board.length)) };
  }
  while (board[c2.y][c2.x] != null) {
    c2 = { x: Math.floor(Math.random() * (board[0].length)), y: Math.floor(Math.random() * (board.length)) };
  }
  return [c1, c2]
}

/**
 * Util methods to check collisions at intersection
 */
export const IntersectionChecker = {
  /**
   * 
   * @param x initial xPos
   * @param y inital yPos
   * @param board 2d array of data
   * @returns first collision left of initial position
   */
  getFirstLeft(x: number, y: number, board: Array<Array<null | Block>>) {
    while (board[y][x] == null && x > 0) {
      x--;
    }
    return board[y][x]
  },

  /**
  * 
  * @param x initial xPos
  * @param y inital yPos
  * @param board 2d array of data
  * @returns first collision right of initial position
  */
  getFirstRight(x: number, y: number, board: Array<Array<null | Block>>) {
    while (board[y][x] == null && x < board[0].length - 1) {
      x++;
    }
    return board[y][x]
  },

  /**
   * 
   * @param x initial xPos
   * @param y inital yPos
   * @param board 2d array of data
   * @returns first collision upwards of initial position
   */
  getFirstUp(x: number, y: number, board: Array<Array<null | Block>>) {
    while (board[y][x] == null && y > 0) {
      y--;
    }
    return board[y][x]
  },

  /**
   * 
   * @param x initial xPos
   * @param y inital yPos
   * @param board 2d array of data
   * @returns first collision downards of initial position
   */
  getFirstDown(x: number, y: number, board: Array<Array<null | Block>>) {
    while (board[y][x] == null && y < board.length - 1) {
      y++;
    }
    return board[y][x]
  }


}

export function mouseCoordinatesToTileIndex(mouseX: number, mouseY: number, tileWidth: number) {
  const x = Math.floor(mouseX / tileWidth);
  const y = Math.floor(mouseY / tileWidth);
  // const x = mouseX / tileWidth
  // const y = mouseY / tileWidth
  return { x, y }
}

