import Population from '../models/population';

export default () => {
  let population = null;
  // eslint-disable-next-line no-restricted-globals
  self.onmessage = ({ data }) => {
    console.log('TEST HERE');
    let results = null;
    switch (data.type) {
      case 'NEW_POPULATION':
        population = new Population(data.size, data.genomeSize, data.target);
        console.log('CREATED A POPULATION', { population });
        break;
      case 'RUN_GENERATION':
        results = population.runGeneration(
          data.selectionType,
          data.eliteCount,
          data.randomNoise,
        );
        postMessage({ results });
        break;
      default:
        throw new Error(`[PopulationWorker] Unknown onmessage type ${data.type}`);
    }
  };
};
