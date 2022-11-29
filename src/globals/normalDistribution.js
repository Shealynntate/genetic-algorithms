//
class NormalDistribution {
  constructor(mean, sigma) {
    this.mean = mean;
    this.sigma = sigma;
    this.base = 1 / (sigma * Math.sqrt(2 * Math.PI));
  }

  f(x) {
    const exp = -0.5 * (((x - this.mean) / this.sigma) ** 2);
    const y = Math.exp(exp) * this.base;

    return y;
  }
}

export default NormalDistribution;
