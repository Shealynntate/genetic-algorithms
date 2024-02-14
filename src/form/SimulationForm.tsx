import React, { type SyntheticEvent, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { canvasParameters } from '../simulation/config'
import { CrossoverTypeLabels, MutationProbabilityFormFields, SelectionTypeLabels } from '../constants/websiteCopy'
import SigmaInput from './SigmaInput'
import { defaultParameters } from '../parameters/config'
import ImageInput from './ImageInput'
import NumberInput from './NumberInput'
import { type ParametersState } from '../parameters/types'
import { mutationProbabilityTypes } from '../population/types'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'

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
      <Grid2 container>
        <Grid2 xs={6} md={4} pr={5}>
          <Typography color='primary' variant='h5' mb={1}>Population</Typography>
          <Tooltip title='Drag n drop a new target image here'>
            <Box>
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
            </Box>
          </Tooltip>
          <Box>
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
          </Box>
        </Grid2>
        <Grid2 xs={12} md={4}>
          <Typography color='primary' variant='h5' mb={1}>Mutation</Typography>
          <Typography variant='h6' color='GrayText'>Probabilities</Typography>
          <Stack>
            {mutationProbabilityTypes.map((key) => (
              <NumberInput
                key={key}
                errors={errors}
                control={control}
                name={`population.mutation.probabilities.${key}`}
                readOnly={readOnly}
                text={MutationProbabilityFormFields[key].text}
                tooltip={MutationProbabilityFormFields[key].tooltip}
                // Icon={MutationProbabilityFormFields[key].Icon}
              />
            ))}
          </Stack>
          <Tooltip title='The sigma parameter for a normal distribution'>
            <Typography variant='h6' color='GrayText'>Distributions</Typography>
          </Tooltip>
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
        </Grid2>
        <Grid2 xs={6} md={4} pl={5}>
            <Typography color='primary' variant='h5' mb={2}>Selection</Typography>
            <FormControl fullWidth size='small'>
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
              size='small'
              {...register('population.selection.type')}
            >
              {Object.entries(SelectionTypeLabels).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <NumberInput
            errors={errors}
            name='population.selection.eliteCount'
            control={control}
            readOnly={readOnly}
            text='Elites'
            validate={(v, state) => (
              ((v % 2 === 0) && v < state.population.size) || 'Elite count must be even and less than the population size'
            )}
          />
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
          <Typography color='primary' variant='h5' mt={1} mb={2}>Crossover</Typography>
          <FormControl fullWidth size='small'>
            <InputLabel id='crossover-label'>Type</InputLabel>
            <Select
              labelId='crossover-label'
              label='Crossover Type'
              defaultValue={population.crossover.type}
              readOnly={readOnly}
              size='small'
              {...register('population.crossover.type')}
            >
              {Object.entries(CrossoverTypeLabels).map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <NumberInput
            errors={errors}
            name='population.crossover.probabilities.swap'
            control={control}
            readOnly={readOnly}
            text='Swap'
            tooltip='Probability of swapping chromosomes'
          />
          <Typography color='primary' variant='h5' my={1}>Stop Criteria</Typography>
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
            text='Max Gens'
          />
        </Grid2>
      </Grid2>
      {!readOnly && (
        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <Button type='submit' variant='contained' size='large'>
            Create
          </Button>
        </Box>
      )}
    </form>
  )
}

export default SimulationForm
