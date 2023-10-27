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
};

class Effects {
  constructor() {}

  pop() {
    const sound = new Howl({
      src: [effects.pop.path],
      volume: 0.2,
    });
    sound.play();
  }

  punch() {
    const sound = new Howl({
      src: [effects.punch.path],
      volume: 0.1,
    });
    sound.play();
  }

  swish() {
    const sound = new Howl({
      src: [effects.swish.path],
      volume: 0.3,
    });
    sound.play();
  }
}
