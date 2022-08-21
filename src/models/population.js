import Organism from './organism';

//
class Population {
  constructor(target, size) {
    this.target = target;
    this.organisms = [...Array(size)].map(() => new Organism(target.length));
  }
}

export default Population;
