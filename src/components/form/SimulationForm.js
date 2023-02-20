/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  CrossoverType,
  DistributionTypes,
  MutationProbabilities,
  ProbabilityTypes,
  SelectionType,
  SelectionTypeLabels,
  CrossoverTypeLabels,
  canvasParameters,
} from '../../constants';
import Checkbox from './Checkbox';
import SigmaInput from './SigmaInput';
import ProbabilityInput from './ProbabilityInput';
import defaultParameters from '../../globals/defaultParameters';
import ImageInput from './ImageInput';
import Panel from '../common/Panel';
import NumberInput from './NumberInput';
import { ParametersType } from '../../types';
import Tooltip from '../common/Tooltip';

function SimulationForm({
  defaultValues,
  imageHeight,
  imageWidth,
  onSubmit,
  readOnly,
}) {
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    getValues,
    register,
    reset,
  } = useForm();
  const {
    population,
    selection,
    crossover,
  } = defaultValues;

  const onImageChange = (image) => {
    setValue('population.target', image);
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" spacing={1}>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Panel label="Population" variant="primary">
            <Stack direction="row" spacing={1}>
              <Tooltip content="Drag n' drop a new target image here">
                <ImageInput
                  defaultTarget={population.target}
                  height={imageHeight}
                  onChange={onImageChange}
                  readOnly={readOnly}
                  width={imageWidth}
                />
                <Input
                  readOnly={readOnly}
                  defaultValue={population.target}
                  sx={{ display: 'none' }}
                  {...register('population.target')}
                />
              </Tooltip>
              <Stack direction="column">
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="population.size"
                  readOnly={readOnly}
                  register={register}
                />
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="population.minPolygons"
                  readOnly={readOnly}
                  register={register}
                />
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="population.maxPolygons"
                  readOnly={readOnly}
                  register={register}
                />
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="population.minPoints"
                  readOnly={readOnly}
                  register={register}
                />
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="population.maxPoints"
                  readOnly={readOnly}
                  register={register}
                />
              </Stack>
            </Stack>
          </Panel>
          <Panel label="Selection" variant="primary">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box display="inline-block">
                <Tooltip
                  content={'Mechanism for selecting parents:\n-Tournament\n-Roulette\n-Stochastic Universal Sampling\n(more info in the About section)'}
                  direction="right"
                >
                  <InputLabel id="select-label">Type</InputLabel>
                </Tooltip>
                <Select
                  labelId="select-label"
                  label="Selection Type"
                  defaultValue={selection.type}
                  readOnly={readOnly}
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
                <NumberInput
                  errors={errors}
                  getValues={getValues}
                  path="selection.eliteCount"
                  register={register}
                  readOnly={readOnly}
                />
                <Box>
                  <NumberInput
                    errors={errors}
                    getValues={getValues}
                    path="selection.tournamentSize"
                    register={register}
                    readOnly={readOnly}
                  />
                </Box>
              </Box>
            </Stack>
          </Panel>
          <Panel label="Crossover" variant="primary">
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack>
                <InputLabel id="crossover-label">Type</InputLabel>
                <Select
                  labelId="crossover-label"
                  label="Crossover Type"
                  defaultValue={crossover.type}
                  readOnly={readOnly}
                  {...register('crossover.type')}
                >
                  {Object.keys(CrossoverType).map((type) => (
                    <MenuItem key={type} value={type}>
                      {CrossoverTypeLabels[type]}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <ProbabilityInput
                register={register}
                readOnly={readOnly}
                path={`crossover.probabilities.${ProbabilityTypes.SWAP}`}
              />
            </Stack>
          </Panel>
        </Stack>
        <Box>
          <Panel label="Mutation" variant="primary">
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Tooltip content="The sigma parameter for a normal distribution">
                  <Typography>Distributions</Typography>
                </Tooltip>
              </Box>
              <Box>
                <SigmaInput
                  path={`mutation.${DistributionTypes.COLOR_SIGMA}`}
                  readOnly={readOnly}
                  register={register}
                />
                <SigmaInput
                  path={`mutation.${DistributionTypes.POINT_SIGMA}`}
                  readOnly={readOnly}
                  register={register}
                />
                <SigmaInput
                  path={`mutation.${DistributionTypes.PERMUTE_SIGMA}`}
                  readOnly={readOnly}
                  register={register}
                />
              </Box>
            </Stack>
            <Stack direction="row" sx={{ alignItems: 'center', pt: 1, justifyContent: 'space-between' }}>
              <Tooltip
                content={'The starting probability (fitness 0) \n and ending probability (fitness 1) \n of each field'}
                direction="left"
              >
                <Typography>Probabilities</Typography>
              </Tooltip>
              <Checkbox
                path="mutation.isSinglePoint"
                readOnly={readOnly}
                register={register}
              />
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1 }}>
              <Stack direction="column" sx={{ alignItems: 'end' }}>
                {MutationProbabilities.map((key) => (
                  <ProbabilityInput
                    key={key}
                    register={register}
                    path={`mutation.probabilities.${key}`}
                    readOnly={readOnly}
                  />
                ))}
              </Stack>
            </Stack>
          </Panel>
          <Panel label="Stop Criteria" variant="primary">
            <NumberInput
              errors={errors}
              getValues={getValues}
              path="stopCriteria.targetFitness"
              register={register}
              readOnly={readOnly}
            />
            <NumberInput
              errors={errors}
              getValues={getValues}
              path="stopCriteria.maxGenerations"
              register={register}
              readOnly={readOnly}
            />
          </Panel>
        </Box>
      </Stack>
      {!readOnly && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button type="submit" variant="contained" size="large">
            Create
          </Button>
        </Box>
      )}
    </form>
  );
}

SimulationForm.propTypes = {
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  onSubmit: PropTypes.func,
  defaultValues: PropTypes.shape(ParametersType),
  readOnly: PropTypes.bool,
};

SimulationForm.defaultProps = {
  imageHeight: canvasParameters.height,
  imageWidth: canvasParameters.width,
  onSubmit: () => {},
  defaultValues: defaultParameters,
  readOnly: false,
};

export default SimulationForm;
