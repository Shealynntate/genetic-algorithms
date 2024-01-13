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
import Panel from '../common/Panel'
import GalleryEntry from '../gallery/GalleryEntry'
import { useGetGalleryEntries } from '../database/hooks'
import { canvasParameters } from '../constants/constants'

function SimulationStatusPanel (): JSX.Element {
  const organismRecord = useSelector((state: RootState) => state.simulation.currentBest)
  const record = useSelector((state: RootState) => state.simulation.currentGenStats)
  const entriesJSON = useGetGalleryEntries() ?? []
  const showContent = organismRecord?.organism != null
  const hasEntries = entriesJSON.length > 0

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
        <Panel label="Your Work">
          {entriesJSON.map((data) => (
            <GalleryEntry
              key={data.id}
              data={data}
            />
          ))}
        </Panel>
      )}
    </Paper>
  )
}

export default SimulationStatusPanel
