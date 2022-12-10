//
class Phenotype {
  constructor(width, height) {
    const options = { height, width };
    this.canvas = document.createElement('canvas', options).transferControlToOffscreen();
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    this.width = width;
    this.height = height;
  }

  scalePoint(point) { return [point[0] * this.width, point[1] * this.height]; }

  getImageData(dna) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    dna.forEach(({ color, points }) => {
      this.ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
      this.ctx.beginPath();
      this.ctx.moveTo(...this.scalePoint(points[0]));
      this.ctx.lineTo(...this.scalePoint(points[1]));
      this.ctx.lineTo(...this.scalePoint(points[2]));
      this.ctx.closePath();
      this.ctx.fill();
    });

    return this.ctx.getImageData(0, 0, this.width, this.height);
  }
}

export default Phenotype;
