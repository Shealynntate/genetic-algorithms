import Chromosome from '../population/chromosomeModel'
import Genome from '../population/genomeModel'

describe('Creating A Genome', () => {
  test('Check Size and NumSides', () => {
    const genome1 = Genome.create({ size: 1, numSides: 3 })
    const genome2 = Genome.create({ size: 3, numSides: 1 })
    expect(genome1.chromosomes.length).toEqual(1)
    expect(genome1.chromosomes[0].points).toHaveLength(3)
    expect(genome2.chromosomes.length).toEqual(3)
    expect(genome2.chromosomes[0].points).toHaveLength(1)
  })
})

describe('Genome Cloning', () => {
  test('Check Clone Functionality', () => {
    const genome1 = Genome.create({ size: 1, numSides: 3 })
    const genome2 = Genome.clone(genome1)
    // Same Chromosome data
    expect(genome1.chromosomes[0].points).toEqual(
      genome2.chromosomes[0].points
    )
    expect(genome1.chromosomes[0].color).toEqual(genome2.chromosomes[0].color)
    // Different Chromosome instances
    genome1.chromosomes[0] = Chromosome.create({ numSides: 3 })
    expect(genome1.chromosomes[0].points).toHaveLength(
      genome2.chromosomes[0].points.length
    )
    // But data should differ (new random chromosome)
    expect(genome1.chromosomes[0].color).not.toEqual(
      genome2.chromosomes[0].color
    )
  })
})
