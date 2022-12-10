/* eslint-disable no-restricted-globals */

let phenotype = null;
let denominator = null;
let tar = null;
export default () => {
  const maxColorValue = 255;
  const numColorChannels = 4;

  class Phenotype {
    constructor(canvas, width, height) {
      this.ctx = canvas.getContext('2d', { willReadFrequently: true });
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

  const evaluateFitness = (target, p) => {
    const pixels = p.data;
    if (pixels.length !== target.length) {
      throw new Error(`[Genome] target length ${target.length} does not match phenotype length ${pixels.length}`);
    }

    let difference = 0;
    // Note: This for-loop is an order of magnitude faster than Array.prototype.forEach
    // Super important here since each length is tens of thousands of pixels per organism
    for (let i = 0; i < pixels.length; i++) {
      difference += Math.abs(pixels[i] - target[i]);
    }

    return (1 - difference / denominator);
  };

  self.onmessage = ({
    data: {
      canvas,
      organisms,
      width,
      height,
      target,
    },
  }) => {
    if (canvas) {
      phenotype = new Phenotype(canvas, width, height);
      tar = target;
      denominator = maxColorValue * numColorChannels * width * height;
      return;
    }
    // if (target) {
    //   tar = target;
    //   return;
    // }
    const results = organisms.map((org) => {
      const data = phenotype.getImageData(org.genome.dna);
      return {
        ...org,
        genome: {
          ...org.genome,
          phenotype: data,
        },
        fitness: evaluateFitness(tar, data),
      };
    });
    postMessage({ results });
  };
};
