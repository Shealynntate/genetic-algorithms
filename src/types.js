import PropTypes from 'prop-types';
import { DistributionTypes, ProbabilityTypes } from './constants';

export const ChromosomeType = {
  points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  color: PropTypes.arrayOf(PropTypes.number),
};

export const GenomeType = {
  size: PropTypes.number,
  chromosome: PropTypes.arrayOf(PropTypes.shape(ChromosomeType)),
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

export const GlobalBestType = {
  id: PropTypes.number,
  organism: PropTypes.shape(OrganismType),
};

export const ImageEntryType = {
  gen: PropTypes.number,
  fitness: PropTypes.number,
  imageData: PropTypes.instanceOf(ImageData),
};

const PopulationType = {
  size: PropTypes.number,
  minPolygons: PropTypes.number,
  maxPolygons: PropTypes.number,
  target: PropTypes.string,
};

const SelectionType = {
  type: PropTypes.string,
  eliteCount: PropTypes.number,
  tournamentSize: PropTypes.number,
};

const CrossoverType = {
  type: PropTypes.string,
  probabilities: PropTypes.shape({
    [ProbabilityTypes.SWAP]: PropTypes.objectOf(PropTypes.number),
  }),
};

const MutationType = {
  [DistributionTypes.COLOR_SIGMA]: PropTypes.number,
  [DistributionTypes.POINT_SIGMA]: PropTypes.number,
  [DistributionTypes.PERMUTE_SIGMA]: PropTypes.number,
  probabilities: PropTypes.shape({
    [ProbabilityTypes.TWEAK]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.ADD_POINT]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.REMOVE_POINT]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.ADD_CHROMOSOME]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.REMOVE_CHROMOSOME]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.RESET_CHROMOSOME]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.PERMUTE_CHROMOSOMES]: PropTypes.objectOf(PropTypes.number),
  }),
};

const StopCriteriaType = {
  targetFitness: PropTypes.number,
  maxGenerations: PropTypes.number,
};

export const ParametersType = {
  population: PropTypes.shape(PopulationType),
  selection: PropTypes.shape(SelectionType),
  crossover: PropTypes.shape(CrossoverType),
  mutation: PropTypes.shape(MutationType),
  stopCriteria: PropTypes.shape(StopCriteriaType),
};
