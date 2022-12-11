import WorkerBuilder from './workerBuilder';
import phenotypeWorker from './phenotype';
import { canvasParameters, maxColorValue, numColorChannels } from '../constants';

const { width, height } = canvasParameters;

const createWorker = (target) => {
  // Create a new worker
  const worker = new WorkerBuilder(phenotypeWorker);
  // Create a canvas to transfer to the worker
  const canvas = document.createElement('canvas', canvasParameters);
  canvas.width = width;
  canvas.height = height;
  const canvasWorker = canvas.transferControlToOffscreen();
  // Post an init message to the worker
  worker.postMessage({
    canvas: canvasWorker,
    numColorChannels,
    maxColorValue,
    target,
  }, [canvasWorker]);

  return worker;
};

export default createWorker;
