import { randomInt } from './utils';

const randomColor = () => [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255), Math.random()];

const randomPoint = () => [Math.random(), Math.random()];

class DNA {
  constructor(points, color) {
    this.points = points || [randomPoint(), randomPoint(), randomPoint()];
    this.color = color || randomColor();
  }
}

export default DNA;
