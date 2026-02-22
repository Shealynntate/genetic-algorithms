import { Divider, Stack, Typography } from '@mui/material'
import { type Control, type FieldErrors, useWatch } from 'react-hook-form'

import NumberInput from '../NumberInput'
import { ParameterLabels } from '../../parameters/config'
import { type ParametersState } from '../../parameters/types'

interface ReviewStepProps {
  control: Control<ParametersState>
  errors: FieldErrors<ParametersState>
}

function ReviewStep({ control, errors }: ReviewStepProps): JSX.Element {
  const values = useWatch({ control })

  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Set your stop criteria and review the configuration before starting the
        experiment.
      </Typography>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Stop Criteria
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          The simulation will stop when either condition is met — the target
          fitness is reached or the maximum generation count is exceeded.
        </Typography>
        <NumberInput
          errors={errors}
          control={control}
          name="stopCriteria.targetFitness"
          text={ParameterLabels.stopCriteria.targetFitness.text}
          tooltip={ParameterLabels.stopCriteria.targetFitness.tooltip}
        />
        <NumberInput
          errors={errors}
          control={control}
          name="stopCriteria.maxGenerations"
          text={ParameterLabels.stopCriteria.maxGenerations.text}
          tooltip={ParameterLabels.stopCriteria.maxGenerations.tooltip}
        />
      </Stack>

      <Divider />

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Summary
        </Typography>
        <Stack spacing={0.5}>
          <SummaryRow
            label="Population size"
            value={values.population?.size}
          />
          <SummaryRow
            label="Polygons"
            value={`${values.population?.minGenomeSize} – ${values.population?.maxGenomeSize}`}
          />
          <SummaryRow
            label="Sides per polygon"
            value={`${values.population?.minPoints} – ${values.population?.maxPoints}`}
          />
          <SummaryRow
            label="Selection"
            value={values.population?.selection?.type}
          />
          <SummaryRow
            label="Crossover"
            value={values.population?.crossover?.type}
          />
          <SummaryRow
            label="Max generations"
            value={values.stopCriteria?.maxGenerations?.toLocaleString()}
          />
          <SummaryRow
            label="Target fitness"
            value={values.stopCriteria?.targetFitness}
          />
        </Stack>
      </Stack>
    </Stack>
  )
}

function SummaryRow({
  label,
  value
}: {
  label: string
  value: string | number | undefined
}): JSX.Element {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value ?? '—'}
      </Typography>
    </Stack>
  )
}

export default ReviewStep
