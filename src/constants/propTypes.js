import PropTypes from 'prop-types';
import { DistributionTypes, ProbabilityTypes } from './typeDefinitions';

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
  isSinglePoint: PropTypes.bool,
  probabilities: PropTypes.shape({
    [ProbabilityTypes.TWEAK_COLOR]: PropTypes.objectOf(PropTypes.number),
    [ProbabilityTypes.TWEAK_POINT]: PropTypes.objectOf(PropTypes.number),
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

export const StatsType = {
  genId: PropTypes.number,
  maxFitness: PropTypes.number,
  meanFitness: PropTypes.number,
  minFitness: PropTypes.number,
  deviation: PropTypes.number,
};

export const ResultsType = {
  threshold: PropTypes.number,
  stats: PropTypes.shape(StatsType),
};

export const SimulationType = {
  id: PropTypes.number,
  createdOn: PropTypes.number,
  status: PropTypes.string,
  name: PropTypes.string,
  lastUpdate: PropTypes.number,
  parameters: PropTypes.shape(ParametersType),
  results: PropTypes.arrayOf(PropTypes.shape(ResultsType)),
};

export const GalleryEntryType = {
  createdOn: PropTypes.number,
  id: PropTypes.number,
  json: PropTypes.string,
  name: PropTypes.string,
  simulationId: PropTypes.number,
};
