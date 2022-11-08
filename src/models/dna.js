import { flipCoin, randomInt } from './utils';

const randomColor = () => [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), Math.random()];

const randomPoint = () => [Math.random(), Math.random()];

class DNA {
  static deserialize({ points, color }) {
    const data = points.split(',').map((p) => parseInt(p, 10));
    const xy = [];
    let i = 0;
    while (i < data) {
      xy.push([data[i], data[i + 1]]);
      i += 2;
    }
    return new DNA(
      xy,
      color.split(',').map((p) => parseInt(p, 10)),
    );
  }

  constructor(points, color) {
    this.points = points || [randomPoint(), randomPoint(), randomPoint()];
    this.color = color || randomColor();
  }

  mutate(rate) {
    // TODO
    if (flipCoin(rate)) {
      this.color = randomColor();
    } else {
      this.points[0] = randomPoint();
    }
  }

  createNode() {
    return {
      points: this.points.toString(),
      color: this.color.toString(),
    };
  }
}

export default DNA;
