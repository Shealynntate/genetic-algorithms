import { type SyntheticEvent, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import _ from 'lodash'

import { useCreateRunningSimulation } from './hooks'
import SimulationChart from './SimulationChart'
import SimulationEntry from './SimulationEntry'
import SimulationFormDialog from './SimulationFormDialog'
import SkeletonExperimentEntry from './SkeletonExperimentEntry'
import { type SimulationStatus } from './types'
import { insertSimulation } from '../database/api'
import { useGetAllButCurrentSimulation } from '../database/hooks'
import { type Simulation } from '../database/types'
import { defaultParameters } from '../parameters/config'
import { type ParametersState } from '../parameters/types'

const statusToOrder: Record<SimulationStatus, number> = {
  running: 0,
  paused: 1,
  pending: 2,
  complete: 3,
  unknown: 4
}

const sortSimulations = (simulations: Simulation[]): Simulation[] => {
  simulations = _.uniqBy(simulations, (s) => s.id)
  const sorted = _.sortBy(simulations, (s) => statusToOrder[s.status])
  return sorted
}

function Simulations(): JSX.Element {
  const theme = useTheme()
  const formData = useRef<ParametersState>(defaultParameters)
  const addButtonRef = useRef<HTMLButtonElement | null>(null)
  const runningSimulation = useCreateRunningSimulation()
  const simulations = useGetAllButCurrentSimulation()
  const [openForm, setOpenForm] = useState(false)

  const isLoading = simulations === undefined
  let allSimulations: Simulation[] = isLoading ? [] : simulations
  if (runningSimulation != null) {
    allSimulations.push(runningSimulation)
  }
  allSimulations = sortSimulations(allSimulations)

  const idToSimulation = (id: number | null): Simulation | undefined => {
    if (id == null) {
      return undefined
    }
    return _.find(allSimulations, (e) => e?.id === id)
  }

  const onAddSimulation = (): void => {
    setOpenForm(true)
  }

  const onCloseForm = (): void => {
    setOpenForm(false)
  }

  const onSubmitForm = (parameters: ParametersState): void => {
    setOpenForm(false)
    if (parameters != null) {
      insertSimulation({ parameters, status: 'pending' }).catch(console.error)
    }
    formData.current = defaultParameters
  }

  const onDuplicate = (event: SyntheticEvent, id: number): void => {
    event.stopPropagation()

    const sim = idToSimulation(id)
    if (sim == null) {
      console.error(`[onDuplicate] Could not find simulation with id ${id}`)
      return
    }
    formData.current = sim.parameters
    setOpenForm(true)
  }

  return (
    <Stack spacing={3}>
      <Stack spacing={1}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Experiments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and manage your evolutionary painting experiments
        </Typography>
      </Stack>

      <Grid2 container spacing={3}>
        <Grid2 xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: 2
            }}
          >
            <Button
              onClick={onAddSimulation}
              color="primary"
              ref={addButtonRef}
              variant="contained"
              startIcon={<AddIcon />}
              sx={{ fontWeight: 600 }}
            >
              New Experiment
            </Button>
          </Box>
          <Stack sx={{ borderRadius: theme.shape.borderRadius }}>
            {isLoading && (
              <Stack spacing={1}>
                <SkeletonExperimentEntry />
                <SkeletonExperimentEntry />
                <SkeletonExperimentEntry />
              </Stack>
            )}
            {!isLoading && allSimulations.length === 0 ? (
              <Card variant="outlined" sx={{ textAlign: 'center', py: 6 }}>
                <CardContent>
                  <ScienceOutlinedIcon
                    sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 1 }}
                  />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No experiments yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Create your first experiment to start evolving polygons into art
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={onAddSimulation}
                  >
                    New Experiment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Stack spacing={1}>
                {allSimulations.map((simulation) => (
                  <SimulationEntry
                    key={simulation.id}
                    simulation={simulation}
                    isActive={runningSimulation?.id === simulation.id}
                    onDuplicate={onDuplicate}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Grid2>
        <Grid2 xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Fitness Over Time
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Track how well your organisms approximate the target image across
                generations. Check experiments in the list to graph them.
              </Typography>
              <SimulationChart />
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>
      <SimulationFormDialog
        defaultValues={formData.current}
        open={openForm}
        onClose={onCloseForm}
        onSubmit={onSubmitForm}
      />
    </Stack>
  )
}

export default Simulations
