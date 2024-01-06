export type Phenotype = ImageData

export interface Chromosome {
  points: number[][]
  color: number[]
}

export interface Genome {
  chromosomes: Chromosome[]
}

export interface Organism {
  id: number
  genome: Genome
  fitness: number
  phenotype?: Phenotype
}
