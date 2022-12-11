/* eslint-disable no-restricted-globals */
export default () => {
  let phenotype = null;

  class Phenotype {
    constructor({
      canvas,
      numColorChannels,
      maxColorValue,
      target,
    }) {
      this.ctx = canvas.getContext('2d', { willReadFrequently: true });
      this.width = canvas.width;
      this.height = canvas.height;
      this.target = target;
      this.denominator = maxColorValue * numColorChannels * this.width * this.height;
    }

    scalePoint(point) {
      return [Math.round(point[0] * this.width), Math.round(point[1] * this.height)];
    }

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

    evaluateFitness(p) {
      const pixels = p.data;
      if (pixels.length !== this.target.length) {
        throw new Error(`Target length ${this.target.length} does not match phenotype length ${pixels.length}`);
      }

      let difference = 0;
      // Note: This for-loop is an order of magnitude faster than Array.prototype.forEach
      // Super important here since each length is tens of thousands of pixels per organism
      for (let i = 0; i < pixels.length; i++) {
        difference += Math.abs(pixels[i] - this.target[i]);
      }

      return (1 - difference / this.denominator);
    }
  }

  self.onmessage = ({
    data: {
      canvas,
      organisms,
      numColorChannels,
      maxColorValue,
      target,
    },
  }) => {
    if (canvas) {
      phenotype = new Phenotype({
        canvas,
        numColorChannels,
        maxColorValue,
        target,
      });
      return;
    }

    const updatedOrganisms = organisms.map((org) => {
      const data = phenotype.getImageData(org.genome.dna);
      return {
        ...org,
        genome: {
          ...org.genome,
          phenotype: data,
        },
        fitness: phenotype.evaluateFitness(data),
      };
    });
    postMessage({ updatedOrganisms });
  };
};
