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
  DistSigmaLabels,
  DistributionTypes,
  MutationProbabilities,
  ProbabilityLabels,
  ProbabilityTypes,
  SelectionType,
  SelectionTypeLabels,
  CrossoverTypeLabels,
  canvasParameters,
} from '../../constants';
import SigmaInput from '../inputs/SigmaInput';
import ProbabilityInput from '../inputs/ProbabilityInput';
import defaultParameters, { ParameterLabels } from '../../globals/defaultParameters';
import ImageInput from '../ImageInput';
import Panel from '../settingsPanels/Panel';
import NumberInput from '../inputs/NumberInput';
import { ParametersType } from '../../types';

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
    mutation,
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
        <Box>
          <Panel label="Population" variant="primary">
            <Stack direction="row" spacing={1}>
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
            <Stack direction="row">
              <Box display="inline-block">
                <InputLabel id="select-label">Type</InputLabel>
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
                  <Typography display="inline-block" pr={1}>{ParameterLabels.selection.tournamentSize}</Typography>
                  <Input
                    defaultValue={selection.tournamentSize}
                    readOnly={readOnly}
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
          <Panel label="Crossover" variant="primary">
            <Stack direction="row">
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
                defaultValues={crossover.probabilities[ProbabilityTypes.SWAP]}
                register={register}
                label={ProbabilityLabels[ProbabilityTypes.SWAP]}
                readOnly={readOnly}
                path={`crossover.probabilities.${ProbabilityTypes.SWAP}`}
              />
            </Stack>
          </Panel>
        </Box>
        <Box>
          <Panel label="Mutation" variant="primary">
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Box>
                <Typography>Distributions</Typography>
              </Box>
              <Box>
                <SigmaInput
                  label={DistSigmaLabels[DistributionTypes.COLOR_SIGMA]}
                  defaultValue={0.01}
                  readOnly={readOnly}
                  {...register(`mutation.${DistributionTypes.COLOR_SIGMA}`, { valueAsNumber: true })}
                />
                <SigmaInput
                  label={DistSigmaLabels[DistributionTypes.POINT_SIGMA]}
                  defaultValue={0.01}
                  readOnly={readOnly}
                  {...register(`mutation.${DistributionTypes.POINT_SIGMA}`, { valueAsNumber: true })}
                />
                <SigmaInput
                  label={DistSigmaLabels[DistributionTypes.PERMUTE_SIGMA]}
                  defaultValue={0.01}
                  readOnly={readOnly}
                  {...register(`mutation.${DistributionTypes.PERMUTE_SIGMA}`, { valueAsNumber: true })}
                />
              </Box>
            </Stack>
            <Typography>Probabilities</Typography>
            <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 1 }}>
              <Stack direction="column" sx={{ alignItems: 'end' }}>
                {MutationProbabilities.map((key) => (
                  <ProbabilityInput
                    key={key}
                    defaultValues={mutation.probabilities[key]}
                    register={register}
                    label={ProbabilityLabels[key]}
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
        <Box sx={{ textAlign: 'center' }}>
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
