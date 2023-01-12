/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import {
  CrossoverType,
  DistSigmaLabels,
  DistributionTypes,
  MutationProbabilities,
  ProbabilityLabels,
  ProbabilityTypes,
  SelectionType,
  SelectionTypeLabels,
  CrossoverTypeLabels,
} from '../constants';
// import ProbabilityInput from './inputs/ProbabilityInput';
import SigmaInput from './inputs/SigmaInput';
import ProbabilityInput from './inputs/ProbabilityInput';
import defaultParameters from '../globals/defaultParameters';

// Create the experiments
const genExperiment = (data) => {
  const parameters = _.cloneDeep(defaultParameters);
  Object.keys(data).forEach((path) => {
    _.set(parameters, path, data[path]);
  });
  return {
    parameters,
    stopCriteria: {
      targetFitness: 0.98,
      maxGenerations: 2_0,
    },
  };
};

function SimulationForm({ open, onClose }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    // Send to database and close form
    onClose(genExperiment(data));
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="xl">
      <DialogTitle>Experiment Form</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row">
            <Box>
              <Typography>Population</Typography>
              <Divider />
              <Box sx={{ display: 'flex' }}>
                <Typography>Size: </Typography>
                {/* <Input
                  defaultValue={defaultParameters.population.size}
                  {...register('population.size', { valueAsNumber: true })}
                  inputProps={{
                    min: 2,
                    max: 500,
                    step: 2,
                    type: 'number',
                  }}
                /> */}
              </Box>
              <Typography>Selection</Typography>
              <Divider />
              <InputLabel id="select-label">Selection Type</InputLabel>
              <Select
                labelId="select-label"
                label="Selection Type"
                defaultValue={defaultParameters.selection.type}
                {...register('selection.type')}
              >
                {Object.keys(SelectionType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {SelectionTypeLabels[type]}
                  </MenuItem>
                ))}
              </Select>
              <Typography>Elite Count: </Typography>
              <Input
                defaultValue={defaultParameters.selection.eliteCount}
                inputProps={{
                  min: 0,
                  max: 500,
                  step: 2,
                  type: 'number',
                }}
                {...register('selection.eliteCount', { valueAsNumber: true })}
              />
              <Typography>Tournament Size: </Typography>
              <Input
                defaultValue={defaultParameters.selection.tournamentSize}
                inputProps={{
                  min: 2,
                  max: 500,
                  step: 2,
                  type: 'number',
                }}
                {...register('selection.tournamentSize', { valueAsNumber: true })}
              />
              <Typography>Crossover</Typography>
              <InputLabel id="crossover-label">Crossover Type</InputLabel>
              <Select
                labelId="crossover-label"
                label="Crossover Type"
                defaultValue={defaultParameters.crossover.type}
                {...register('crossover.type')}
              >
                {Object.keys(CrossoverType).map((type) => (
                  <MenuItem key={type} value={type}>
                    {CrossoverTypeLabels[type]}
                  </MenuItem>
                ))}
              </Select>
              <ProbabilityInput
                defaultValues={defaultParameters.crossover.probabilities[ProbabilityTypes.SWAP]}
                register={register}
                label={ProbabilityLabels[ProbabilityTypes.SWAP]}
                path={`crossover.probabilities.${ProbabilityTypes.SWAP}`}
              />
            </Box>
            <Box>
              <Typography variant="subtitle1">Mutation</Typography>
              <Divider />
              <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                <Box>
                  <Typography>Distributions</Typography>
                </Box>
                <Box>
                  <SigmaInput
                    label={DistSigmaLabels[DistributionTypes.COLOR_SIGMA]}
                    defaultValue={0.01}
                    {...register(`mutation.${DistributionTypes.COLOR_SIGMA}`, { valueAsNumber: true })}
                  />
                  <SigmaInput
                    label={DistSigmaLabels[DistributionTypes.POINT_SIGMA]}
                    defaultValue={0.01}
                    {...register(`mutation.${DistributionTypes.POINT_SIGMA}`, { valueAsNumber: true })}
                  />
                  <SigmaInput
                    label={DistSigmaLabels[DistributionTypes.PERMUTE_SIGMA]}
                    defaultValue={0.01}
                    {...register(`mutation.${DistributionTypes.PERMUTE_SIGMA}`, { valueAsNumber: true })}
                  />
                </Box>
              </Stack>
              <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1 }}>
                <Box sx={{ pr: 1 }}>
                  <Typography>Probabilities</Typography>
                </Box>
                <Stack direction="column" sx={{ alignItems: 'end' }}>
                  {MutationProbabilities.map((key) => (
                    <ProbabilityInput
                      key={key}
                      defaultValues={defaultParameters.mutation.probabilities[key]}
                      register={register}
                      label={ProbabilityLabels[key]}
                      path={`mutation.probabilities.${key}`}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          </Stack>
          <Button type="submit" variant="contained">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

SimulationForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

SimulationForm.defaultProps = {
  open: false,
  onClose: () => {},
};

export default SimulationForm;
