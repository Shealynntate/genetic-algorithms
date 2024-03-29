import React, { type SyntheticEvent, useRef, useState } from 'react'
import { Box, Button, Paper, Stack, Tooltip, Typography, useTheme } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import _ from 'lodash'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { type Simulation } from '../database/types'
import { type ParametersState } from '../parameters/types'
import { type SimulationStatus } from './types'
import { insertSimulation } from '../database/api'
import { useGetAllButCurrentSimulation } from '../database/hooks'
import SimulationChart from './SimulationChart'
import SimulationEntry from './SimulationEntry'
import SimulationFormDialog from './SimulationFormDialog'
import { defaultParameters } from '../parameters/config'
import { useCreateRunningSimulation } from './hooks'
import SkeletonExperimentEntry from './SkeletonExperimentEntry'

const statusToOrder: Record<SimulationStatus, number> = {
  running: 0,
  paused: 1,
  pending: 2,
  complete: 3,
  unknown: 4
}

const sortSimulations = (simulations: Simulation[]): Simulation[] => {
  // Remove duplicate simulations by id
  simulations = _.uniqBy(simulations, (s) => s.id)
  const sorted = _.sortBy(simulations, (s) => statusToOrder[s.status])
  return sorted
}

function Simulations (): JSX.Element {
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
    // Reset the form data for the next time the form is opened
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
    <Stack>
      <Grid2 container spacing={1}>
        <Grid2 xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
              alignItems: 'center'
            }}
          >
            <Typography variant='h5' color='GrayText'>Experiments</Typography>
            <Tooltip title='Add a new run'>
              <Button
                onClick={onAddSimulation}
                color='secondary'
                ref={addButtonRef}
                sx={{ boxShadow: 'none' }}
                variant='outlined'
                size='small'
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Tooltip>
          </Box>
          <Stack sx={{ borderRadius: theme.shape.borderRadius }}>
            {isLoading && (
              <Stack spacing={0.5}>
                <SkeletonExperimentEntry />
                <SkeletonExperimentEntry />
                <SkeletonExperimentEntry />
              </Stack>
            )}
            {!isLoading && allSimulations.length === 0
              ? <Paper sx={{ textAlign: 'center' }}>
                  <Typography>
                    Create a new entry and watch it run!
                  </Typography>
                </Paper>
              : <Stack spacing={0.5}>
                  {allSimulations.map((simulation) => (
                    <SimulationEntry
                      key={simulation.id}
                      simulation={simulation}
                      isActive={runningSimulation?.id === simulation.id}
                      onDuplicate={onDuplicate}
                    />
                  ))}
                </Stack>
            }
          </Stack>
        </Grid2>
        <Grid2 xs={12} md={6} spacing={1}>
          <Paper sx={{ mt: 5 }}>
            <SimulationChart />
          </Paper>
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
