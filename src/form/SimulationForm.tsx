import React, { type SyntheticEvent, useEffect } from 'react'
import {
  Box,
  Button,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { canvasParameters } from '../constants/constants'
import { CrossoverTypeLabels, MutationProbabilityFormFields, SelectionTypeLabels } from '../constants/websiteCopy'
import Checkbox from './Checkbox'
import SigmaInput from './SigmaInput'
import { defaultParameters } from '../parameters/config'
import ImageInput from './ImageInput'
import Panel from '../common/Panel'
import NumberInput from './NumberInput'
import { type ParametersState } from '../parameters/types'
import { mutationProbabilityTypes } from '../population/types'

interface SimulationFormProps {
  imageHeight?: number
  imageWidth?: number
  onSubmit?: (data: ParametersState) => void
  defaultValues?: ParametersState
  readOnly?: boolean
}

function SimulationForm ({
  defaultValues = defaultParameters,
  imageHeight = canvasParameters.height,
  imageWidth = canvasParameters.width,
  onSubmit = () => {},
  readOnly = false
}: SimulationFormProps): JSX.Element {
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    register,
    reset
  } = useForm<ParametersState>({ defaultValues })
  const { population } = defaultValues

  const onImageChange = (image: string): void => {
    setValue('population.target', image)
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const localOnSubmit = (event: SyntheticEvent): void => {
    event.preventDefault()
    handleSubmit(onSubmit)().catch(console.error)
  }

  return (
    <form onSubmit={localOnSubmit}>
      <Stack direction='row' spacing={1}>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Panel label='Population' variant='primary'>
            <Stack direction='row' spacing={1}>
              <Tooltip title='Drag n drop a new target image here'>
                <>
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
                </>
              </Tooltip>
              <Stack direction='column'>
                <NumberInput
                  errors={errors}
                  name='population.size'
                  readOnly={readOnly}
                  control={control}
                  text='Size'
                  tooltip='How many organisms are in the population'
                  validate={(value) => (value % 2 === 0 || 'Population size must be even')}
                />
                <NumberInput
                  errors={errors}
                  name='population.minGenomeSize'
                  readOnly={readOnly}
                  control={control}
                  text='Min △'
                  tooltip='Min number of chromosomes (polygons) an organism can have'
                  validate={(v, state) => (
                    (v <= state.population.maxGenomeSize) || 'Min polygons can\'t be greater than max polygons'
                  )}
                />
                <NumberInput
                  errors={errors}
                  name='population.maxGenomeSize'
                  readOnly={readOnly}
                  control={control}
                  text='Max △'
                  tooltip='Max number of chromosomes (polygons) an organism can have'
                  validate={(v, state) => (
                    (v >= state.population.minGenomeSize) || 'Max polygons can\'t be less than min polygons'
                  )}
                />
                <NumberInput
                  errors={errors}
                  name='population.minPoints'
                  readOnly={readOnly}
                  control={control}
                  text='Min Sides'
                  tooltip='Min number of points a chromosome (polygon) can have'
                  validate={(v, state) => (
                    (v <= state.population.maxPoints) || 'Min number of sides can\'t be greater than max sides'
                  )}
                />
                <NumberInput
                  errors={errors}
                  name='population.maxPoints'
                  readOnly={readOnly}
                  control={control}
                  text='Max Sides'
                  tooltip='Max number of points a chromosome (polygon) can have'
                  validate={(v, state) => (
                    (v >= state.population.minPoints) || 'Max number of sides can\'t be less than min sides'
                  )}
                />
              </Stack>
            </Stack>
          </Panel>
          <Panel label='Selection' variant='primary'>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Box display='inline-block'>
                <Tooltip
                  title={'Mechanism for selecting parents:\n-Tournament\n-Roulette\n-Stochastic Universal Sampling\n(more info in the About section)'}
                >
                  <InputLabel id='select-label'>Type</InputLabel>
                </Tooltip>
                <Select
                  labelId='select-label'
                  label='Selection Type'
                  defaultValue={population.selection.type}
                  readOnly={readOnly}
                  {...register('population.selection.type')}
                >
                  {Object.entries(SelectionTypeLabels).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box>
                <NumberInput
                  errors={errors}
                  name='population.selection.eliteCount'
                  control={control}
                  readOnly={readOnly}
                  text='Elite Count'
                  validate={(v, state) => (
                    ((v % 2 === 0) && v < state.population.size) || 'Elite count must be even and less than the population size'
                  )}
                />
                <Box>
                  <NumberInput
                    errors={errors}
                    name='population.selection.tournamentSize'
                    control={control}
                    readOnly={readOnly}
                    text='Tourney Size'
                    validate={(v, state) => (
                      (v < state.population.size) || 'Tournament size must be less than the population size'
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </Panel>
          <Panel label='Crossover' variant='primary'>
            <Stack direction='row' spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack>
                <InputLabel id='crossover-label'>Type</InputLabel>
                <Select
                  labelId='crossover-label'
                  label='Crossover Type'
                  defaultValue={population.crossover.type}
                  readOnly={readOnly}
                  {...register('population.crossover.type')}
                >
                  {Object.entries(CrossoverTypeLabels).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>
              <NumberInput
                control={control}
                name={'population.crossover.probabilities.swap'}
                errors={errors}
                readOnly={readOnly}
                text={'Swap'}
              />
            </Stack>
          </Panel>
        </Stack>
        <Box>
          <Panel label='Mutation' variant='primary'>
            <Stack>
              <Box>
                <Tooltip title='The sigma parameter for a normal distribution'>
                  <Typography>Distributions</Typography>
                </Tooltip>
              </Box>
              <Stack direction='row' sx={{ justifyContent: 'space-between' }}>
                <Box />
                <Box>
                  <SigmaInput
                    name={'population.mutation.distributions.colorSigma'}
                    readOnly={readOnly}
                    control={control}
                    text='Color'
                    tooltip='Should tweak mutations apply\nonce per gene or should each\npoint and color have a uniform\nchance of being tweaked'
                  />
                  <SigmaInput
                    name={'population.mutation.distributions.pointSigma'}
                    readOnly={readOnly}
                    control={control}
                    text='Point'
                    tooltip='How far a point (x,y) can get nudged'
                  />
                  <SigmaInput
                    name={'population.mutation.distributions.permuteSigma'}
                    readOnly={readOnly}
                    control={control}
                    text='Permute'
                    tooltip='How many chromosomes can swap their order at a time'
                  />
                </Box>
              </Stack>
            </Stack>
            <Stack direction='row' sx={{ alignItems: 'center', pt: 1, justifyContent: 'space-between' }}>
              <Tooltip
                title={'The starting probability (fitness 0) \n and ending probability (fitness 1) \n of each field'}
              >
                <Typography>Probabilities</Typography>
              </Tooltip>
              <Checkbox
                name='population.mutation.isSinglePoint'
                readOnly={readOnly}
                control={control}
                text='Single Point'
                tooltip='Should tweak mutations apply\nonce per gene or should each\npoint and color have a uniform\nchance of being tweaked'
              />
            </Stack>
            <Stack direction='row' sx={{ justifyContent: 'space-between', pt: 1 }}>
              <Stack direction='column' sx={{ alignItems: 'end' }}>
                {mutationProbabilityTypes.map((key) => (
                  <NumberInput
                    key={key}
                    errors={errors}
                    control={control as any}
                    name={`population.mutation.probabilities.${key}`}
                    readOnly={readOnly}
                    text={MutationProbabilityFormFields[key].text}
                    tooltip={MutationProbabilityFormFields[key].tooltip}
                    // Icon={MutationProbabilityFormFields[key].Icon}
                  />
                ))}
              </Stack>
            </Stack>
          </Panel>
          <Panel label='Stop Criteria' variant='primary'>
            <NumberInput
              errors={errors}
              control={control}
              name='stopCriteria.targetFitness'
              readOnly={readOnly}
              text='Target Fitness'
            />
            <NumberInput
              errors={errors}
              control={control}
              name='stopCriteria.maxGenerations'
              readOnly={readOnly}
              text='Max Generations'
            />
          </Panel>
        </Box>
      </Stack>
      {!readOnly && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button type='submit' variant='contained' size='large'>
            Create
          </Button>
        </Box>
      )}
    </form>
  )
}

export default SimulationForm
