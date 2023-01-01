/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListSubheader,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CrossoverType, MutationProbabilityTypes, SelectionType } from '../constants';
import ProbabilityInput from './inputs/ProbabilityInput';
// import ProbabilityInput from './inputs/ProbabilityInput';
import SigmaInput from './inputs/SigmaInput';
import defaultTarget from '../assets/mona_lisa.jpeg';

const TERMINATING_FITNESS = 1;

// Experiment 1
const initialState = {
  populationSize: 200,
  triangleCount: 1,
  maxTriangleCount: 50,
  target: defaultTarget,
  crossover: {
    type: CrossoverType.ONE_POINT,
    probMap: [
      {
        threshold: 0,
        values: {
          prob: 0.9,
        },
      },
    ],
  },
  mutation: {
    // Distribution Sigmas
    colorSigma: 0.01, // 0.25 / n
    pointSigma: 0.01,
    permuteSigma: 0.05, // TODO
    probMap: {
      [MutationProbabilityTypes.TWEAK]: {
        startValue: 0.006,
        endValue: 0.004,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.ADD_POINT]: {
        startValue: 0.005,
        endValue: 0.005,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.REMOVE_POINT]: {
        startValue: 0.001,
        endValue: 0.001,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.ADD_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.005,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.REMOVE_CHROMOSOME]: {
        startValue: 0.005,
        endValue: 0.005,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.RESET_CHROMOSOME]: {
        startValue: 0.0001,
        endValue: 0.0003,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
      [MutationProbabilityTypes.PERMUTE_CHROMOSOMES]: {
        startValue: 0.01,
        endValue: 0.01,
        startFitness: 0,
        endFitness: TERMINATING_FITNESS,
      },
    },
  },
  selection: {
    type: SelectionType.TOURNAMENT,
    eliteCount: 0,
    tournamentSize: 2,
  },
};

// Create the experiments
const genExperiments = ({
  startRange,
  endRange,
  stepSize,
  type,
}) => {
  const experiments = [];
  for (let i = startRange[1]; i < startRange[0]; i += stepSize) {
    for (let j = endRange[1]; j < endRange[0]; j += stepSize) {
      experiments.push({
        parameters: {
          ...initialState,
          [type]: {
            startValue: i,
            endValue: j,
            startFitness: 0,
            endFitness: TERMINATING_FITNESS,
          },
        },
        stopCriteria: {
          targetFitness: 0.98,
          maxGenerations: 20_000,
        },
      });
    }
  }
  return experiments;
};

function ExperimentForm({ open, onClose }) {
  const { register, handleSubmit } = useForm();
  const [thresholds, setThresholds] = useState([]);

  const onSubmit = (data) => {
    // Send to database and close form
    console.log(data);
    const experimentField = {
      type: MutationProbabilityTypes.TWEAK,
      startRange: [0.1, 0.005],
      endRange: [0.01, 0.001],
      stepSize: 0.001,
    };
    onClose(genExperiments(experimentField));
  };

  const onAddThreshold = () => {
    const values = {};
    Object.keys(MutationProbabilityTypes).forEach((type) => { values[type] = 0; });
    setThresholds([...thresholds, { threshold: 0, values }]);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Experiment Form</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <List>
            <ListSubheader>Sigmas</ListSubheader>
            <ListItem>
              <SigmaInput label="Color" defaultValue={0.01} {...register('colorSigma')} />
            </ListItem>
            <ListItem>
              <SigmaInput label="Points" defaultValue={0.01} {...register('pointsSigma')} />
            </ListItem>
            <ListItem>
              <SigmaInput label="Permute" defaultValue={0.01} {...register('permuteSigma')} />
            </ListItem>
          </List>
          <Typography>Probabilities</Typography>
          {thresholds.map(({ threshold, values }) => (
            <div key={`threshold-${threshold}`}>
              <Box>
                <Typography>Threshold</Typography>
                <Typography>{threshold}</Typography>
              </Box>
              {Object.keys(values).map((key) => (
                <ProbabilityInput
                  key={`treshold-${threshold}-prob-${key}`}
                  type={key}
                  defaultValue={values[key]}
                  {...register(`${key}-${threshold}`)}
                />
              ))}
            </div>
          ))}
          <Button onClick={onAddThreshold}>Add Threshold</Button>
          <Button type="submit" variant="contained">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

ExperimentForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

ExperimentForm.defaultProps = {
  open: false,
  onClose: () => {},
};

export default ExperimentForm;
