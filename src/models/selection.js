//
class Selection {
  constructor(data) {
    this.initialize(data);
  }

  initialize({ type, eliteCount, tournamentSize }) {
    this.type = type;
    this.eliteCount = eliteCount;
    this.tournamentSize = tournamentSize;
  }

  serialize() {
    return {
      type: this.type,
      eliteCount: this.eliteCount,
      tournamentSize: this.tournamentSize,
    };
  }

  deserialize(data) {
    this.initialize(data);
  }
}

export default Selection;
