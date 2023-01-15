/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
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
import SigmaInput from './inputs/SigmaInput';
import ProbabilityInput from './inputs/ProbabilityInput';
import defaultParameters from '../globals/defaultParameters';
import ImageInput from './ImageInput';
import Panel from './settingsPanels/Panel';
import NumberInput from './inputs/NumberInput';

function SimulationForm({ open, onClose }) {
  const { register, handleSubmit, setValue } = useForm();
  const {
    population,
    selection,
    crossover,
    mutation,
  } = defaultParameters;

  const onSubmit = (data) => {
    // Send to database and close form
    onClose(data);
  };

  const onImageChange = (image) => {
    setValue('population.target', image);
  };

  return (
    <Dialog open={open} onClose={() => onClose()} maxWidth="xl">
      <DialogTitle sx={{ py: 0.5 }}>Simulation Setup</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="row" spacing={1}>
            <Box>
              <Panel label="Population">
                <Stack direction="row">
                  <ImageInput
                    defaultTarget={population.target}
                    onChange={onImageChange}
                  />
                  <Input
                    defaultValue={population.target}
                    sx={{ display: 'none' }}
                    {...register('population.target')}
                  />
                  <Stack direction="column">
                    <NumberInput path="population.size" register={register} />
                    <Typography>Min Polygons: </Typography>
                    <Input
                      defaultValue={population.minPolygons}
                      {...register('population.minPolygons', { valueAsNumber: true })}
                      inputProps={{
                        min: 1,
                        max: 100,
                        step: 1,
                        type: 'number',
                      }}
                    />
                    <Typography>Max Polygons: </Typography>
                    <Input
                      defaultValue={population.maxPolygons}
                      {...register('population.maxPolygons', { valueAsNumber: true })}
                      inputProps={{
                        min: 1,
                        max: 100,
                        step: 1,
                        type: 'number',
                      }}
                    />
                  </Stack>
                </Stack>
              </Panel>
              <Panel label="Selection">
                <Stack direction="row">
                  <Box display="inline-block">
                    <InputLabel id="select-label">Type</InputLabel>
                    <Select
                      labelId="select-label"
                      label="Selection Type"
                      defaultValue={selection.type}
                      {...register('selection.type')}
                    >
                      {Object.keys(SelectionType).map((type) => (
                        <MenuItem key={type} value={type}>
                          {SelectionTypeLabels[type]}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Box>
                    <Box>
                      <Typography display="inline-block" pr={1}>Elite Count: </Typography>
                      <Input
                        defaultValue={selection.eliteCount}
                        inputProps={{
                          min: 0,
                          max: 500,
                          step: 2,
                          type: 'number',
                        }}
                        {...register('selection.eliteCount', { valueAsNumber: true })}
                      />
                    </Box>
                    <Box>
                      <Typography display="inline-block" pr={1}>Tournament Size: </Typography>
                      <Input
                        defaultValue={selection.tournamentSize}
                        inputProps={{
                          min: 2,
                          max: 500,
                          step: 2,
                          type: 'number',
                        }}
                        {...register('selection.tournamentSize', { valueAsNumber: true })}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Panel>
              <Panel label="Crossover">
                <InputLabel id="crossover-label">Type</InputLabel>
                <Select
                  labelId="crossover-label"
                  label="Crossover Type"
                  defaultValue={crossover.type}
                  {...register('crossover.type')}
                >
                  {Object.keys(CrossoverType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {CrossoverTypeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
                <ProbabilityInput
                  defaultValues={crossover.probabilities[ProbabilityTypes.SWAP]}
                  register={register}
                  label={ProbabilityLabels[ProbabilityTypes.SWAP]}
                  path={`crossover.probabilities.${ProbabilityTypes.SWAP}`}
                />
              </Panel>
              <Panel label="Stop Criteria">
                <NumberInput path="stopCriteria.targetFitness" register={register} />
                <NumberInput path="stopCriteria.maxGenerations" register={register} />
              </Panel>
            </Box>
            <Box>
              <Panel label="Mutation">
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
                        defaultValues={mutation.probabilities[key]}
                        register={register}
                        label={ProbabilityLabels[key]}
                        path={`mutation.probabilities.${key}`}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Panel>
              <Button type="submit" variant="contained">Save</Button>
            </Box>
          </Stack>
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
