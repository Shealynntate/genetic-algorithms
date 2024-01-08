import theme from '../theme';
import { AppState } from './typeDefinitions';

export const RunningStates = [
  AppState.RUNNING,
];

// --------------------------------------------------
export const maxPopulation = 500;

export const maxGenerations = 500_000;

export const targetFitness = 1;

export const statsSigFigs = 5;

export const workerBatchSize = 40;

export const minResultsThreshold = 0.90;

export const saveThresholds = [
  { threshold: 60, mod: 20 },
  { threshold: 100, mod: 50 },
  { threshold: 300, mod: 100 },
  { threshold: 1_000, mod: 200 },
  { threshold: 5_000, mod: 500 },
  { threshold: 10_000, mod: 1_000 },
  { threshold: 50_000, mod: 5_000 },
  { threshold: maxGenerations, mod: 10_000 },
];

// ------------------------------------------------------------
export const maxColorValue = 255;

export const numColorChannels = 4;

export const canvasParameters = {
  width: 200,
  height: 200,
};

export const defaultLineColor = theme.palette.primary.main;

export const lineColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
  theme.palette.warning.main,
  theme.palette.info.main,
  theme.palette.success.main,

  theme.palette.primary.light,
  theme.palette.secondary.light,
  theme.palette.error.light,
  theme.palette.warning.light,
  theme.palette.info.light,
  theme.palette.success.light,

  theme.palette.primary.dark,
  theme.palette.secondary.dark,
  theme.palette.error.dark,
  theme.palette.warning.dark,
  theme.palette.info.dark,
  theme.palette.success.dark,
];

export const projectUrl = 'https://github.com/Shealynntate/genetic-algorithms';

export const MIN_BROWSER_WIDTH = 400;

export const MIN_BROWSER_HEIGHT = 400;
