import React from 'react'
import { Box, Typography } from '@mui/material'
import { type Simulation } from '../database/types'
import SimulationForm from '../form/SimulationForm'

interface SimulationDetailsProps {
  simulation?: Simulation
}

function SimulationDetails ({ simulation }: SimulationDetailsProps): JSX.Element | null {
  if (simulation == null) {
    return null
  }
  const { id, name, parameters } = simulation

  return (
    <Box>
      <Typography>{`${id}. ${name}`}</Typography>
      <SimulationForm
        imageWidth={130}
        imageHeight={130}
        readOnly
        defaultValues={parameters}
      />
    </Box>
  )
}

export default SimulationDetails
