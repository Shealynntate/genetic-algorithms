import React, { type SyntheticEvent, useRef, useState } from 'react'
import { Box, Fab, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import _ from 'lodash'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { type Simulation } from '../database/types'
import { type ParametersState } from '../parameters/types'
import { type SimulationStatus } from './types'
import { insertSimulation } from '../database/api'
import { useGetAllSimulations, useGetCurrentSimulation } from '../database/hooks'
import SimulationChart from './SimulationChart'
import SimulationButtons from './SimulationButtons'
import SimulationEntry from './SimulationEntry'
import SimulationDetails from './SimulationDetails'
import SimulationFormDialog from './SimulationFormDialog'
import RunningSimulationDisplay from './RunningSimulationDisplay'
import { defaultParameters } from '../parameters/config'

const statusToOrder: Record<SimulationStatus, number> = {
  running: 0,
  paused: 1,
  pending: 2,
  complete: 3,
  unknown: 4
}

const sortSimulations = (simulations: Simulation[]): Simulation[] => {
  const sorted = _.sortBy(simulations, (s) => statusToOrder[s.status])
  return sorted
}

function Simulations (): JSX.Element {
  const theme = useTheme()
  const runningSimulation = useGetCurrentSimulation()
  const simulations = useGetAllSimulations() ?? []
  const allSimulations = sortSimulations(simulations)
  const queuedSimulations = allSimulations.filter((s) => s.status === 'pending')
  const formData = useRef<ParametersState>(defaultParameters)
  const [openForm, setOpenForm] = useState(false)
  const [selectedSimulation, setSelectedSimulation] = useState<number | null>(null)

  const idToSimulation = (id: number | null): Simulation | undefined => {
    if (id == null) {
      return undefined
    }
    const all = [...allSimulations, runningSimulation]
    return _.find(all, (e) => e?.id === id)
  }

  const onAddSimulation = (): void => {
    setOpenForm(true)
  }

  const onCloseForm = (): void => {
    setOpenForm(false)
  }

  const onSubmitForm = (parameters: ParametersState): void => {
    setOpenForm(false)
    formData.current = defaultParameters
    if (parameters != null) {
      insertSimulation({ parameters, status: 'pending' }).catch(console.error)
    }
  }

  const onSelect = (id: number | null): void => {
    setSelectedSimulation(id)
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
    <Stack>
      <Typography variant="h4" sx={{ textAlign: 'center' }}>Experiment</Typography>
      <SimulationChart />
      <Grid2 container mt={1}>
        <Grid2 xs={12} md={6}>
          <Stack
            sx={{
              backgroundColor: theme.palette.grey[100],
              borderRadius: theme.shape.borderRadius,
              p: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 1,
                alignItems: 'center'
              }}
            >
              <Stack direction="row" spacing={1}>
                <Typography variant="h6">Experiment Runs</Typography>
                <SimulationButtons runsDisabled={queuedSimulations.length === 0} />
              </Stack>
              <Tooltip title="Add a new run">
                <Fab
                  onClick={onAddSimulation}
                  color="secondary"
                  size="extrasmall"
                  sx={{ boxShadow: 'none' }}
                >
                  <AddIcon fontSize="small" />
                </Fab>
              </Tooltip>
            </Box>
            <Stack spacing={0.5}>
              {allSimulations.map((simulation) => (
                <SimulationEntry
                  key={simulation.id}
                  simulation={simulation}
                  isSelected={selectedSimulation === simulation.id}
                  onDuplicate={onDuplicate}
                  onSelect={onSelect}
                />
              ))}
            </Stack>
          </Stack>
        </Grid2>
        <Grid2 xs={12} md={6} spacing={1}>
          <RunningSimulationDisplay
            simulation={runningSimulation}
          />
          <SimulationDetails simulation={idToSimulation(selectedSimulation)} />
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
