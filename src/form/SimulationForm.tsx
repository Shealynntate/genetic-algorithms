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
import React, { type SyntheticEvent, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { canvasParameters } from '../constants/constants'
import { CrossoverTypeLabels, MutationProbabilityFormFields, SelectionTypeLabels } from '../constants/websiteCopy'
import Checkbox from './Checkbox'
import SigmaInput from './SigmaInput'
import ProbabilityInput from './ProbabilityInput'
import { defaultParameters } from '../parameters/config'
import ImageInput from './ImageInput'
import Panel from '../common/Panel'
import NumberInput from './NumberInput'
import { type ParametersState } from '../parameters/types'
import { type MutationProbabilityType, mutationProbabilityTypes } from '../population/types'

const singlePointFields: MutationProbabilityType[] = ['tweak']
const nonSinglePointFields: MutationProbabilityType[] = ['tweakColor', 'tweakPoint']

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
    reset,
    watch
  } = useForm<ParametersState>({ defaultValues })
  const { population } = defaultValues

  const onImageChange = (image: string): void => {
    setValue('population.target', image)
  }

  useEffect(() => {
    reset(defaultValues)
  }, [defaultValues])

  const watchSinglePoint = watch('population.mutation.isSinglePoint')
  const hiddenFields: MutationProbabilityType[] = watchSinglePoint ? nonSinglePointFields : singlePointFields

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
                />
                <NumberInput
                  errors={errors}
                  name='population.minGenomeSize'
                  readOnly={readOnly}
                  control={control}
                  text='Min △'
                  tooltip='Min number of chromosomes (polygons) an organism can have'
                />
                <NumberInput
                  errors={errors}
                  name='population.maxGenomeSize'
                  readOnly={readOnly}
                  control={control}
                  text='Max △'
                  tooltip='Max number of chromosomes (polygons) an organism can have'
                />
                <NumberInput
                  errors={errors}
                  name='population.minPoints'
                  readOnly={readOnly}
                  control={control}
                  text='Min Sides'
                  tooltip='Min number of points a chromosome (polygon) can have'
                />
                <NumberInput
                  errors={errors}
                  name='population.maxPoints'
                  readOnly={readOnly}
                  control={control}
                  text='Max Sides'
                  tooltip='Max number of points a chromosome (polygon) can have'
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
                />
                <Box>
                  <NumberInput
                    errors={errors}
                    name='population.selection.tournamentSize'
                    control={control}
                    readOnly={readOnly}
                    text='Tourney Size'
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
              <ProbabilityInput
                control={control}
                readOnly={readOnly}
                name={'population.crossover.probabilityParameters.swap'}
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
                  <ProbabilityInput
                    key={key}
                    control={control}
                    name={`population.mutation.probabilityParameters.${key}`}
                    readOnly={readOnly}
                    hide={hiddenFields.includes(key)}
                    text={MutationProbabilityFormFields[key].text}
                    tooltip={MutationProbabilityFormFields[key].tooltip}
                    Icon={MutationProbabilityFormFields[key].Icon}
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
