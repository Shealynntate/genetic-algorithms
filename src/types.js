import PropTypes from 'prop-types';

export const DNAType = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  color: PropTypes.arrayOf(PropTypes.number),
};

export const DNANodeType = {
  points: PropTypes.string,
  color: PropTypes.string,
};

export const GenomeType = {
  size: PropTypes.number,
  dna: PropTypes.arrayOf(PropTypes.shape(DNAType)),
  phenotype: PropTypes.shape(ImageData),
};

export const GenomeNodeType = {
  size: PropTypes.number,
  dna: PropTypes.arrayOf(PropTypes.shape(DNANodeType)),
};

// The type that results from calling createNode() on an Organsim
export const OrganismType = {
  id: PropTypes.number,
  parentA: PropTypes.number,
  parentB: PropTypes.number,
  genome: PropTypes.shape(GenomeType),
  fitness: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.number),
};
// The type that results from calling createGenNode() on a Population
export const GenerationType = {
  id: PropTypes.number,
  meanFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismType)),
};
// The child type used for OrganismNodeType (has no children to prevent recursion)
export const OrganismChildNodeType = {
  id: PropTypes.number,
  genome: GenomeType,
  fitness: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
};
// The Organism type used when rendering the Genealogy tree
export const OrganismNodeType = {
  id: PropTypes.number,
  genome: PropTypes.shape(GenomeType),
  fitness: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.shape(OrganismChildNodeType)),
};

export const GenerationNodeType = {
  id: PropTypes.number,
  x: PropTypes.number,
  meanFitness: PropTypes.number,
  maxFitness: PropTypes.number,
  minFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismNodeType)),
};
