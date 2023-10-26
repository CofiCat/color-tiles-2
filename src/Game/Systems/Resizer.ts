import type { intersection } from "astro/zod";
import { calculateAspectRatioFit } from "./util";
import { Container } from "pixi.js";
import type { Dimensions } from "../types/2d.utils";

const borderWidth = 20;

const borderRadius = 20 * 2;
// const screenRatio = screen.width / (screen.height * 1.1);
const screenRatio = 23 / 14;
const windowInset = 0.9;

export default class Resizer {
  rescalers: Array<Container>;
  screenRatio: number;
  curDims: Dimensions;
  prevDims: Dimensions;
  prevWindowDims: Dimensions;

  constructor(width: number, height: number, prevWindowDims: Dimensions) {
    this.rescalers = [];
    this.screenRatio = width / height;
    this.curDims = prevWindowDims;
    this.prevDims = this.curDims;
    this.prevWindowDims = prevWindowDims;
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
    console.log("prev dims", this.prevDims);
    this.prevDims = this.curDims;
    this.curDims = newDims;
    return newDims;
  }

  addToRescalers(...args: Container[]) {
    this.rescalers.push(...args);
  }

  rescale() {
    console.log("before", this.prevDims, this.curDims, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.curDims.width = window.innerWidth;
    this.curDims.height = window.innerHeight;
    console.log("after", this.prevDims, this.curDims, {
      width: window.innerWidth,
      height: window.innerHeight,
    });
    if (this.calcAspect(this.curDims) === this.calcAspect(this.prevDims)) {
      console.log("is ZOOM");
      console.log(this.curDims, this.prevDims);
    } else {
      console.log(
        "is NOT zoom",
        this.calcAspect(this.curDims),
        this.calcAspect(this.prevDims)
      );
      console.log(" not zoom");
    }

    this.prevDims.width = this.curDims.width;
    this.prevDims.height = this.curDims.height;
    return;

    const rescaleXAmount = this.curDims.width / this.prevDims.width;
    const rescaleYAmount = this.curDims.height / this.prevDims.height;
    this.rescalers.forEach((container) => {
      const curScaleX = container.scale.x;
      const curScaleY = container.scale.y;

      console.log("scale factor", rescaleXAmount);
      container.scale.x = curScaleX * rescaleXAmount;
      container.scale.y = curScaleX * rescaleYAmount;
    });
  }

  hasResized(curWindowDims: Dimensions) {
    let res;
    if (
      curWindowDims.width !== this.prevWindowDims.width ||
      curWindowDims.height !== this.prevWindowDims.height
    ) {
      res = true;
    } else {
      res = false;
    }
    this.prevWindowDims = curWindowDims;
    return res;
  }

  calcAspect(dims: Dimensions) {
    return dims.width / dims.height;
  }
}
