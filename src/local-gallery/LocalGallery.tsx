import AddIcon from '@mui/icons-material/Add'
import BrushIcon from '@mui/icons-material/Brush'
import { Box, Button, Card, CardContent, Stack, Typography, useTheme } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { useNavigate } from 'react-router-dom'

import LocalGalleryEntry from './LocalGalleryEntry'
import { useGetCompletedSimulationReports } from '../database/hooks'
import { NavPaths } from '../navigation/config'

function LocalGallery(): JSX.Element {
  const completedEntries = useGetCompletedSimulationReports() ?? []
  const hasEntries = completedEntries.length > 0
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Your Art
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Results from your local experiments
        </Typography>
      </Stack>
      {hasEntries ? (
        <Grid2 container spacing={3}>
          {completedEntries.map((simulationReport) => (
            <Grid2 key={simulationReport.simulation.id} xs={12} sm={6} lg={4}>
              <LocalGalleryEntry data={simulationReport} />
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Card variant="outlined" sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <BrushIcon
              sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No artwork yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Run an experiment to see your evolved art appear here
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => { navigate(NavPaths.experiment) }}
            >
              Start an Experiment
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default LocalGallery
