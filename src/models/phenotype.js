import { canvasParameters } from '../constants';

const { width, height } = canvasParameters;

const scalePoint = (point) => [point[0] * width, point[1] * height];

class Phenotype {
  constructor() {
    const options = { height, width };
    this.canvas = document.createElement('canvas', options);
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  update(dna) {
    this.ctx.clearRect(0, 0, width, height);
    dna.forEach(({ color, points }) => {
      this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
      this.ctx.beginPath();
      this.ctx.moveTo(...scalePoint(points[0]));
      this.ctx.lineTo(...scalePoint(points[1]));
      this.ctx.lineTo(...scalePoint(points[2]));
      this.ctx.closePath();
      this.ctx.fill();
    });
  }

  getPixels() {
    return this.ctx.getImageData(0, 0, width, height);
  }

  getCanvas() {
    return this.canvas;
  }
}

export default Phenotype;
