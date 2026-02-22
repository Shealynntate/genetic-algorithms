import { Box, Input, Stack, Tooltip, Typography } from '@mui/material'
import {
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type UseFormSetValue
} from 'react-hook-form'

import ImageInput from '../ImageInput'
import NumberInput from '../NumberInput'
import { ParameterLabels } from '../../parameters/config'
import { type ParametersState } from '../../parameters/types'
import { canvasParameters } from '../../simulation/config'

interface ImageStepProps {
  control: Control<ParametersState>
  errors: FieldErrors<ParametersState>
  register: UseFormRegister<ParametersState>
  setValue: UseFormSetValue<ParametersState>
  defaultTarget: string
}

function ImageStep({
  control,
  errors,
  register,
  setValue,
  defaultTarget
}: ImageStepProps): JSX.Element {
  const onImageChange = (image: string): void => {
    setValue('population.target', image)
  }

  return (
    <Stack spacing={3}>
      <Typography variant="body1" color="text.secondary">
        Choose the target image that the algorithm will try to recreate using
        semi-transparent polygons. Drag and drop an image or use the default.
      </Typography>

      <Tooltip title="Drag and drop a new target image here">
        <Box>
          <ImageInput
            defaultTarget={defaultTarget}
            height={canvasParameters.height}
            onChange={onImageChange}
            width={canvasParameters.width}
          />
          <Input
            defaultValue={defaultTarget}
            sx={{ display: 'none' }}
            {...register('population.target')}
          />
        </Box>
      </Tooltip>
    </Stack>
  )
}

export default ImageStep
