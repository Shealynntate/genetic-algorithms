import PropTypes from 'prop-types';

// The type that results from calling createNode() on an Organsim
export const OrganismType = {
  id: PropTypes.number,
  parentA: PropTypes.number,
  parentB: PropTypes.number,
  genome: PropTypes.string,
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
  genome: PropTypes.string,
  fitness: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  index: PropTypes.number,
};
// The Organism type used when rendering the Genealogy tree
export const OrganismNodeType = {
  id: PropTypes.number,
  genome: PropTypes.string,
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
