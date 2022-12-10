export default () => {
  const maxColorValue = 255;
  const numColorChannels = 4;
  const width = 180;
  const height = 180;
  const denominator = maxColorValue * numColorChannels * width * height;

  const evaluateFitness = (target, phenotype) => {
    const pixels = phenotype.data;
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

  // eslint-disable-next-line no-restricted-globals
  self.onmessage = ({
    data: {
      phenotypes,
      target,
    },
  }) => {
    const results = [];
    for (let i = 0; i < phenotypes.length; ++i) {
      results.push(evaluateFitness(target, phenotypes[i]));
    }
    postMessage({ results });
  };
};
