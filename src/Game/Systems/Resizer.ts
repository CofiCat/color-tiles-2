import type { intersection } from "astro/zod";
import { calculateAspectRatioFit } from "./util";
import { Container } from "pixi.js";

const borderWidth = 20;

const borderRadius = 20 * 2;
// const screenRatio = screen.width / (screen.height * 1.1);
const screenRatio = 23 / 14;
const windowInset = 0.9;

export default class Resizer {
  rescalers: Array<Container>;
  screenRatio: number;
  curWidth: number;
  prevWidth: number;

  constructor(width: number, height: number) {
    this.rescalers = [];
    this.screenRatio = width / height;
    this.curWidth = this.calcResize().width;
    this.prevWidth = this.curWidth;
  }

  calcResize() {
    const screenWidth = window.innerWidth * windowInset + borderRadius;
    const screenHeight =
      (window.innerWidth * windowInset + borderRadius) / this.screenRatio;
    const bottomUIInset = screenHeight / 10;
    const newDims = calculateAspectRatioFit(
      screenWidth,
      screenHeight + bottomUIInset,
      // window.innerHeight * windowInset + borderRadius,
      Math.min(
        screen.width * 0.7 - borderRadius,
        window.innerWidth - borderRadius
      ),
      window.innerHeight * windowInset - borderRadius
    );
    this.prevWidth = this.curWidth;
    this.curWidth = newDims.width;
    return newDims;
  }

  addToRescalers(...args: Container[]) {
    this.rescalers.push(...args);
  }

  rescale() {
    if (this.curWidth === this.prevWidth) return;

    const rescaleAmount = this.curWidth / this.prevWidth;
    this.rescalers.forEach((container) => {
      const curScaleX = container.scale.x;
      const curScaleY = container.scale.y;

      container.scale.x = curScaleX * rescaleAmount;
      container.scale.y = curScaleX * rescaleAmount;
    });
  }
}
