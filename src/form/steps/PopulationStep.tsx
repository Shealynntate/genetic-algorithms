import { Stack, Typography } from '@mui/material'
import { type Control, type FieldErrors } from 'react-hook-form'

import NumberInput from '../NumberInput'
import { ParameterLabels } from '../../parameters/config'
import { type ParametersState } from '../../parameters/types'

interface PopulationStepProps {
  control: Control<ParametersState>
  errors: FieldErrors<ParametersState>
}

function PopulationStep({
  control,
  errors
}: PopulationStepProps): JSX.Element {
  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Configure the population of organisms. Each organism is a collection of
        semi-transparent polygons that will evolve to approximate the target image.
      </Typography>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Population
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How many organisms compete each generation. Larger populations explore
          more solutions but run slower.
        </Typography>
        <NumberInput
          errors={errors}
          name="population.size"
          control={control}
          text={ParameterLabels.population.size.text}
          tooltip={ParameterLabels.population.size.tooltip}
          validate={(value) =>
            value % 2 === 0 || 'Population size must be even'
          }
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Polygon Count
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          The range of polygons each organism can have. More polygons allow finer
          detail but increase computation.
        </Typography>
        <NumberInput
          errors={errors}
          name="population.minGenomeSize"
          control={control}
          text={ParameterLabels.population.minPolygons.text}
          tooltip={ParameterLabels.population.minPolygons.tooltip}
          validate={(v, state) =>
            v <= state.population.maxGenomeSize ||
            "Min polygons can't be greater than max polygons"
          }
        />
        <NumberInput
          errors={errors}
          name="population.maxGenomeSize"
          control={control}
          text={ParameterLabels.population.maxPolygons.text}
          tooltip={ParameterLabels.population.maxPolygons.tooltip}
          validate={(v, state) =>
            v >= state.population.minGenomeSize ||
            "Max polygons can't be less than min polygons"
          }
        />
      </Stack>

      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Polygon Sides
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          How many sides (vertices) each polygon can have. Triangles are fast,
          more sides allow smoother shapes.
        </Typography>
        <NumberInput
          errors={errors}
          name="population.minPoints"
          control={control}
          text={ParameterLabels.population.minPoints.text}
          tooltip={ParameterLabels.population.minPoints.tooltip}
          validate={(v, state) =>
            v <= state.population.maxPoints ||
            "Min sides can't be greater than max sides"
          }
        />
        <NumberInput
          errors={errors}
          name="population.maxPoints"
          control={control}
          text={ParameterLabels.population.maxPoints.text}
          tooltip={ParameterLabels.population.maxPoints.tooltip}
          validate={(v, state) =>
            v >= state.population.minPoints ||
            "Max sides can't be less than min sides"
          }
        />
      </Stack>
    </Stack>
  )
}

export default PopulationStep
