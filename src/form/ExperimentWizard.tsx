import { useState } from 'react'

import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useForm } from 'react-hook-form'

import EvolutionStep from './steps/EvolutionStep'
import ImageStep from './steps/ImageStep'
import PopulationStep from './steps/PopulationStep'
import ReviewStep from './steps/ReviewStep'
import { defaultParameters } from '../parameters/config'
import { type ParametersState } from '../parameters/types'

const steps = ['Target Image', 'Population', 'Evolution', 'Review']

interface ExperimentWizardProps {
  defaultValues?: ParametersState
  onSubmit: (data: ParametersState) => void
  onCancel: () => void
}

function ExperimentWizard({
  defaultValues = defaultParameters,
  onSubmit,
  onCancel
}: ExperimentWizardProps): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeStep, setActiveStep] = useState(0)
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    register,
    trigger
  } = useForm<ParametersState>({ defaultValues })

  const handleNext = async (): Promise<void> => {
    const isValid = await trigger()
    if (isValid) {
      setActiveStep((prev) => prev + 1)
    }
  }

  const handleBack = (): void => {
    setActiveStep((prev) => prev - 1)
  }

  const handleCreate = (): void => {
    handleSubmit(onSubmit)().catch(console.error)
  }

  return (
    <Box>
      <Stepper
        activeStep={activeStep}
        alternativeLabel={!isMobile}
        orientation={isMobile ? 'vertical' : 'horizontal'}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 300, mb: 3 }}>
        {activeStep === 0 && (
          <ImageStep
            control={control}
            errors={errors}
            register={register}
            setValue={setValue}
            defaultTarget={defaultValues.population.target}
          />
        )}
        {activeStep === 1 && (
          <PopulationStep control={control} errors={errors} />
        )}
        {activeStep === 2 && (
          <EvolutionStep
            control={control}
            errors={errors}
            register={register}
            defaultValues={defaultValues}
          />
        )}
        {activeStep === 3 && (
          <ReviewStep control={control} errors={errors} />
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`
        }}
      >
        <Button onClick={activeStep === 0 ? onCancel : handleBack}>
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => { handleNext().catch(console.error) }}
          >
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleCreate}>
            Create
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default ExperimentWizard
