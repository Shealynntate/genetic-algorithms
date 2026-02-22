import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material'
import {
  type Control,
  type FieldErrors,
  type UseFormRegister
} from 'react-hook-form'

import NumberInput from '../NumberInput'
import SigmaInput from '../SigmaInput'
import {
  CrossoverTypeLabels,
  MutationProbabilityFormFields,
  ParameterLabels,
  SelectionTypeLabels
} from '../../parameters/config'
import { type ParametersState } from '../../parameters/types'
import { mutationProbabilityTypes } from '../../population/types'

interface EvolutionStepProps {
  control: Control<ParametersState>
  errors: FieldErrors<ParametersState>
  register: UseFormRegister<ParametersState>
  defaultValues: ParametersState
}

function EvolutionStep({
  control,
  errors,
  register,
  defaultValues
}: EvolutionStepProps): JSX.Element {
  const { population } = defaultValues

  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Fine-tune how organisms mutate, how parents are selected, and how
        genetic material is combined. These settings control the evolutionary
        pressure and exploration rate.
      </Typography>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Mutation Probabilities
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          The chance of each type of mutation occurring per gene. Small values
          (0.001) work best for gradual refinement.
        </Typography>
        {mutationProbabilityTypes.map((key) => (
          <NumberInput
            key={key}
            errors={errors}
            control={control}
            name={`population.mutation.probabilities.${key}`}
            text={MutationProbabilityFormFields[key].text}
            tooltip={MutationProbabilityFormFields[key].tooltip}
          />
        ))}
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Mutation Distributions
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How far mutations can nudge values. A sigma of 0.1 means most changes
          will be within 10% of the current value.
        </Typography>
        <SigmaInput
          name="population.mutation.distributions.colorSigma"
          control={control}
          text={ParameterLabels.population.mutation.colorSigma.text}
          tooltip={ParameterLabels.population.mutation.colorSigma.tooltip}
        />
        <SigmaInput
          name="population.mutation.distributions.pointSigma"
          control={control}
          text={ParameterLabels.population.mutation.pointSigma.text}
          tooltip={ParameterLabels.population.mutation.pointSigma.tooltip}
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Selection
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How parents are chosen for reproduction. Tournament selection picks the
          best from random subgroups.
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="select-label">Type</InputLabel>
          <Select
            labelId="select-label"
            label="Selection Type"
            defaultValue={population.selection.type}
            size="small"
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
          name="population.selection.eliteCount"
          control={control}
          text={ParameterLabels.population.selection.eliteCount.text}
          tooltip={ParameterLabels.population.selection.eliteCount.tooltip}
          validate={(v, state) =>
            (v % 2 === 0 && v < state.population.size) ||
            'Elite count must be even and less than the population size'
          }
        />
        <NumberInput
          errors={errors}
          name="population.selection.tournamentSize"
          control={control}
          text={ParameterLabels.population.selection.tournamentSize.text}
          tooltip={ParameterLabels.population.selection.tournamentSize.tooltip}
          validate={(v, state) =>
            v < state.population.size ||
            'Tournament size must be less than the population size'
          }
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Crossover
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How genetic material from two parents is combined to create offspring.
        </Typography>
        <FormControl fullWidth size="small">
          <InputLabel id="crossover-label">Type</InputLabel>
          <Select
            labelId="crossover-label"
            label="Crossover Type"
            defaultValue={population.crossover.type}
            size="small"
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
          name="population.crossover.probabilities.swap"
          control={control}
          text={ParameterLabels.population.crossover.probabilities.swap.text}
          tooltip={ParameterLabels.population.crossover.probabilities.swap.tooltip}
        />
      </Stack>
    </Stack>
  )
}

export default EvolutionStep
