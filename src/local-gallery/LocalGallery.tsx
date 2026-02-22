import { Box, Paper, Typography } from '@mui/material'

import LocalGalleryEntry from './LocalGalleryEntry'
import { useGetCompletedSimulationReports } from '../database/hooks'

function LocalGallery(): JSX.Element {
  const completedEntries = useGetCompletedSimulationReports() ?? []
  const hasEntries = completedEntries.length > 0

  return (
    <Box>
      <Typography variant="h4" color="GrayText" sx={{ textAlign: 'center' }}>
        Your Art
      </Typography>
      {hasEntries ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flexWrap: 'wrap'
          }}
        >
          {completedEntries.map((simulationReport) => (
            <LocalGalleryEntry
              key={simulationReport.simulation.id}
              data={simulationReport}
            />
          ))}
        </Box>
      ) : (
        <Box>
          <Paper sx={{ textAlign: 'center' }}>
            <Typography color="GrayText">
              Run some experiments to see the results here!
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default LocalGallery
