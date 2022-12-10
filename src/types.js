import PropTypes from 'prop-types';

export const DNAType = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  color: PropTypes.arrayOf(PropTypes.number),
};

export const GenomeType = {
  size: PropTypes.number,
  dna: PropTypes.arrayOf(PropTypes.shape(DNAType)),
  phenotype: PropTypes.shape(ImageData),
};

// The type that results from calling createNode() on an Organsim
export const OrganismType = {
  id: PropTypes.number,
  genome: PropTypes.shape(GenomeType),
  fitness: PropTypes.number,
};

// The type that results from calling createGenNode() on a Population
export const GenerationType = {
  id: PropTypes.number,
  meanFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismType)),
};

export const GenerationNodeType = {
  id: PropTypes.number,
  x: PropTypes.number,
  meanFitness: PropTypes.number,
  maxFitness: PropTypes.number,
  minFitness: PropTypes.number,
  deviation: PropTypes.number,
  organisms: PropTypes.arrayOf(PropTypes.shape(OrganismType)),
  maxFitOrganism: PropTypes.shape(OrganismType),
};

export const GlobalBestType = {
  id: PropTypes.number,
  organism: PropTypes.shape(OrganismType),
};

export const ImageEntryType = {
  gen: PropTypes.number,
  fitness: PropTypes.number,
  imageData: PropTypes.instanceOf(ImageData),
};
