import React from 'react'
import {
  Box,
  Paper,
  Typography
} from '@mui/material'
import { useGetCompletedSimulationReports } from '../database/hooks'
import LocalGalleryEntry from '../gallery/LocalGalleryEntry'

function SimulationStatusPanel (): JSX.Element {
  const completedEntries = useGetCompletedSimulationReports() ?? []
  const hasEntries = completedEntries.length > 0

  return (
    <Paper>
      {hasEntries
        ? (
        <Box>
          {completedEntries.map((simulationReport) => (
            <LocalGalleryEntry
              key={simulationReport.simulation.id}
              data={simulationReport}
            />
          ))}
        </Box>
          )
        : (
        <Box>
          <Typography variant='h6'>Run some experiments to see the results here!</Typography>
        </Box>
          )}
    </Paper>
  )
}

export default SimulationStatusPanel
