import Chromosome from '../models/chromosome';
import Genome from '../models/genome';

describe('Creating A Genome', () => {
  test('Check Size and NumSides', () => {
    const genome1 = Genome.create({ size: 1, numSides: 3 });
    const genome2 = Genome.create({ size: 3, numSides: 1 });
    expect(genome1.chromosomes.length).toEqual(1);
    expect(genome1.chromosomes[0].points.length).toEqual(3);
    expect(genome2.chromosomes.length).toEqual(3);
    expect(genome2.chromosomes[0].points.length).toEqual(1);
  });

  test('Check Setting Chromosomes Manually', () => {
    const chromosomes = Chromosome.create();
    const genome = Genome.create({ chromosomes });
    expect(genome.chromosomes).toEqual(chromosomes);
  });
});

describe('Genome Cloning', () => {
  test('Check Clone Functionality', () => {
    const genome1 = Genome.create({ size: 1, numSides: 3 });
    const genome2 = Genome.clone(genome1);
    // Same Chromosomes
    expect(genome1.chromosomes).toEqual(genome2.chromosomes);
    // Different Chromosome instances
    genome1.chromosomes[0] = Chromosome.create();
    expect(genome1.chromosomes).not.toEqual(genome2.chromosomes);
  });
});
