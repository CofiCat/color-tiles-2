import { Container, DisplayObject } from "pixi.js";

export default class World {
  world: Container
  constructor(initialMembers: [DisplayObject]) {
    this.world = new Container();
    this.init(initialMembers)
  }

  init(initialMembers: [DisplayObject]) {
    this.world.addChild(...initialMembers);
    return this.world;
  }
}