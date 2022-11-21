/**
 *
 */
class LoadedDie {
  constructor(sides) {
    this.sides = sides;
    this.u = [];
    this.k = [];
  }

  // ------------------------------------------------------------
  load(probabilities) {
    const uFull = [];

    for (let i = 0; i < this.sides; ++i) {
      this.u[i] = this.sides * probabilities[i];
      if (this.u[i] === 1) {
        this.k[i] = i;
        uFull[i] = true;
      }
    }

    // eslint-disable-next-line no-constant-condition
    while (true) {
      let over = -1;
      let under = -1;
      // Find an entry > 1 and an entry < 1
      for (let i = 0; i < this.sides; ++i) {
        if (this.u[i] < 1 && under < 0 && !uFull[i]) {
          under = i;
        }
        if (this.u[i] > 1 && over < 0 && !uFull[i]) {
          over = i;
        }
      }
      // Theoretically an error, but can occur due to floating point rounding
      if ((over >= 0 && under < 0) || (over < 0 && under >= 0)) {
        if (over >= 0) {
          this.u[over] = 1;
        } else {
          this.u[under] = 1;
        }
        // eslint-disable-next-line no-continue
        continue;
      } else if (over < 0 && under < 0) {
        // Finished filling out the tables
        break;
      }

      this.u[over] -= 1 - this.u[under];
      this.k[under] = over;
      uFull[under] = true;
    }
  }

  roll() {
    const x = Math.random();
    const index = Math.trunc(this.sides * x);
    const y = this.sides * x - index;

    if (y < this.u[index]) {
      return index;
    }
    return this.k[index];
  }
}

export default LoadedDie;
