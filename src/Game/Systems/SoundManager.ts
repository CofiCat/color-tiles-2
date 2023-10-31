const baseUrl = import.meta.env.BASE_URL;
const effectsBasePath = baseUrl + "/sounds/effects/";

export default class SoundManager {
  effects: Effects;
  constructor() {
    this.effects = new Effects();
  }
}

const effects = {
  pop: {
    path: effectsBasePath + "pop.mp3",
  },
  punch: {
    path: effectsBasePath + "punch.mp3",
  },
  swish: {
    path: effectsBasePath + "swish.mp3",
  },
  tap: {
    path: effectsBasePath + "tap.mp3",
  },
  stageComplete: {
    path: effectsBasePath + "stage-complete.mp3",
  },
};

class Effects {
  constructor() {}

  play(path: string, volume: number) {
    const sound = new Howl({
      src: [path],
      volume: 0.3,
    });
    sound.play();
  }
  pop() {
    this.play(effects.pop.path, 0.2);
  }

  punch() {
    this.play(effects.punch.path, 0.1);
  }

  swish() {
    this.play(effects.swish.path, 0.3);
  }

  tap() {
    this.play(effects.tap.path, 0.4);
  }
  stageComplete() {
    this.play(effects.stageComplete.path, 0.4);
  }
}
