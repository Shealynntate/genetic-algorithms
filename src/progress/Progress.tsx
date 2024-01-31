import React from 'react'
import {
  Box,
  Paper,
  Stack,
  Typography
} from '@mui/material'
import { useSelector } from 'react-redux'
import { type RootState } from '../store'
import OrganismCanvas from '../canvas/OrganismCanvas'
import HistoryDisplay from './HistoryDisplay'
import StatusText from '../common/StatusText'
import GalleryEntry from '../gallery/GalleryEntry'
import { canvasParameters } from '../constants/constants'
import { useGetCompletedSimulationReports } from '../database/hooks'

function SimulationStatusPanel (): JSX.Element {
  const organismRecord = useSelector((state: RootState) => state.simulation.currentBest)
  const record = useSelector((state: RootState) => state.simulation.currentGenStats)
  const completedEntries = useGetCompletedSimulationReports() ?? []
  const showContent = organismRecord?.organism != null
  const hasEntries = completedEntries.length > 0

  return (
    <Paper>
      {showContent
        ? (
        <>
          <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={1}>
            <Box>
              <OrganismCanvas
                organism={organismRecord.organism}
                width={canvasParameters.width}
                height={canvasParameters.height}
                willReadFrequently={false}
              />
            </Box>
            <Box>
              <StatusText label="Generation">
                {record?.stats.gen.toLocaleString() ?? 0}
              </StatusText>
              <StatusText label="Max Fitness">
                {record?.stats.maxFitness?.toFixed(4) ?? 0}
              </StatusText>
              <StatusText label="Mean Fitness">
                {record?.stats.meanFitness?.toFixed(4) ?? 0}
              </StatusText>
              <StatusText label="Min Fitness">
                {record?.stats.minFitness?.toFixed(4) ?? 0}
              </StatusText>
              <StatusText label="Deviation">
                {record?.stats.deviation?.toFixed(4) ?? 0}
              </StatusText>
              <StatusText label="Num △">
                {organismRecord?.organism.genome.chromosomes.length ?? 0}
              </StatusText>
            </Box>
          </Stack>
          <HistoryDisplay />
        </>
          )
        : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            color="GrayText"
            mt={3}
            mb={6}
            mx="auto"
          >
            Start a run to see a live view of fitness statistics and progress snapshots in this tab
          </Typography>
        </Box>
          )}
      {hasEntries && (
        <Box>
          {completedEntries.map((simulationReport) => (
            <GalleryEntry
              key={simulationReport.simulation.id}
              simulationReport={simulationReport}
            />
          ))}
        </Box>
      )}
    </Paper>
  )
}

export default SimulationStatusPanel
