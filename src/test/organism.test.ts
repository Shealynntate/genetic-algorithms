import ChromosomeModel from '../population/chromosomeModel'
import Organism from '../population/organismModel'

beforeEach(() => {
  // Reset ID generation
  Organism.reset()
})

describe('Creating An Organism', () => {
  test('Check ID Incrementation', () => {
    const org1 = Organism.create({ size: 1, numSides: 3 })
    expect(org1.id).toEqual(0)
    const org2 = Organism.create({ size: 1, numSides: 3 })
    expect(org2.id).toEqual(1)
    const org3 = Organism.create({ size: 1, numSides: 3 })
    expect(org3.id).toEqual(2)
  })

  test('Check ID Reset', () => {
    const org1 = Organism.create({ size: 1, numSides: 3 })
    expect(org1.id).toEqual(0)
    const org2 = Organism.create({ size: 1, numSides: 3 })
    expect(org2.id).toEqual(1)

    Organism.reset()

    const org3 = Organism.create({ size: 1, numSides: 3 })
    expect(org3.id).toEqual(0)
  })

  test('Check Setting ID Manually', () => {
    const org1 = Organism.create({ id: 5, size: 1, numSides: 3 })
    expect(org1.id).toEqual(5)
    const org2 = Organism.create({ size: 1, numSides: 3 })
    expect(org2.id).toEqual(0)
  })
})

describe('Organism Cloning', () => {
  test('Check Clone Functionality', () => {
    const org1 = Organism.create({ size: 1, numSides: 3 })
    const org2 = Organism.clone(org1)
    // Different Ids
    expect(org1.id).toEqual(0)
    expect(org2.id).toEqual(1)
    // Same Genome data
    expect(org1.genome.chromosomes.length).toEqual(
      org2.genome.chromosomes.length
    )
    for (let i = 0; i < org1.genome.chromosomes.length; i++) {
      expect(org1.genome.chromosomes[i].color.r).toEqual(
        org2.genome.chromosomes[i].color.r
      )
    }
    // Different Genome instances (deep clone)
    const newChrom = ChromosomeModel.create({ numSides: 3 })
    org1.genome.chromosomes[0] = newChrom
    expect(org1.genome.chromosomes[0].color.r).not.toEqual(
      org2.genome.chromosomes[0].color.r
    )
  })
})
