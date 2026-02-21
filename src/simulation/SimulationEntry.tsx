import React, { type SyntheticEvent, useState, type ChangeEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { type Simulation } from '../database/types'
import {
  addGraphEntry,
  deleteRunningSimulation,
  removeGraphEntry
} from '../navigation/navigationSlice'
import { deleteSimulation, renameSimulation } from '../database/api'
import { useGraphColor, useIsGraphEntry } from '../navigation/hooks'
import StatusIcon from './StatusIcon'
import MaxFitnessDisplay from './MaxFitnessDisplay'
import RunningSimulationDisplay from './RunningSimulationDisplay'
import ActionButtons from './ActionButtons'
import SimulationSummary from './SimulationSummary'
import { type RootState } from '../store'
import StatText from './StatText'

interface SimulationEntryProps {
  simulation: Simulation
  isActive?: boolean
  onDuplicate?: (event: SyntheticEvent, id: number) => void
  onSelect?: (id: number | null) => void
}

function SimulationEntry({
  simulation,
  onDuplicate = (event: SyntheticEvent, id: number) => {},
  onSelect = (id: number | null) => {},
  isActive = false
}: SimulationEntryProps): JSX.Element {
  const { id, createdOn, name, status, population } = simulation
  const theme = useTheme()
  const dispatch = useDispatch()
  const currentGenStats = useSelector(
    (state: RootState) => state.simulation.currentGenStats
  )
  const maxFitOrganism = useSelector(
    (state: RootState) => state.simulation.globalBest
  )
  const [nameValue, setNameValue] = useState(name)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const isChecked = useIsGraphEntry(id as number)
  const color = useGraphColor(id as number)
  const gen = isActive
    ? currentGenStats?.stats.gen ?? 0
    : population?.genId ?? 0
  const maxFitness = isActive
    ? maxFitOrganism?.organism.fitness ?? 0
    : population?.best?.organism.fitness ?? 0
  const isPending = status === 'pending'
  const date = new Date(createdOn)
  const openMenu = Boolean(anchorEl)

  if (id == null) {
    console.error('SimulationEntry: id is null')
    return <></>
  }

  const onDelete = (event: SyntheticEvent): void => {
    event.stopPropagation()
    if (isActive) {
      dispatch(deleteRunningSimulation())
    } else {
      deleteSimulation(id).catch(console.error)
    }
  }

  const onChangeName = (event: ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target
    setNameValue(value)
    renameSimulation(id, value).catch(console.error)
  }

  const onCheck = (event: SyntheticEvent): void => {
    event.stopPropagation()
    if (isChecked) {
      dispatch(removeGraphEntry(id))
    } else {
      dispatch(addGraphEntry(id))
    }
  }

  const onMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const onMenuClose = (): void => {
    setAnchorEl(null)
  }

  return (
    <Paper
      elevation={1}
      sx={{
        py: 1,
        px: 0,
        border: isActive ? `1px solid ${theme.palette.primary.main}` : null
      }}
      onClick={() => {
        onSelect(id)
      }}
    >
      <Stack
        direction="row"
        sx={{ position: 'relative', py: isPending ? 2 : 0 }}
        spacing={1}
      >
        <Box>
          <Checkbox
            checked={isChecked}
            disabled={isPending}
            size="small"
            onClick={(event) => {
              onCheck(event)
            }}
            sx={{
              color: color ?? 'inherit',
              '&.Mui-checked': {
                color: color ?? 'inherit'
              }
            }}
          />
        </Box>
        <Stack sx={{ position: 'relative', flex: 1 }}>
          <TextField
            value={nameValue}
            onChange={onChangeName}
            variant="standard"
            size="small"
          />
          <StatusIcon
            status={status}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: '0.25rem'
            }}
          >
            <Typography color="GrayText" sx={{ fontSize: '0.7rem' }}>
              {id}
            </Typography>
            {isActive ? (
              <Stack direction="row" spacing={1.5}>
                <StatText
                  text="Max"
                  value={currentGenStats?.stats.maxFitness ?? 0}
                />
                <StatText
                  text="Mean"
                  value={currentGenStats?.stats.meanFitness ?? 0}
                />
                <StatText
                  text="Min"
                  value={currentGenStats?.stats.minFitness ?? 0}
                />
              </Stack>
            ) : (
              <StatText
                sigFigs={0}
                text="△"
                value={
                  population?.best?.organism.genome.chromosomes.length ?? 0
                }
              />
            )}
            <Typography
              variant="lightCaption"
              fontFamily="Oxygen Mono, monospace"
            >
              {`${gen.toLocaleString()} gen`}
            </Typography>
          </Box>
          {isActive && <RunningSimulationDisplay simulation={simulation} />}
        </Stack>
        <ActionButtons
          isActive={isActive}
          simulation={simulation}
          sx={{ position: 'absolute', top: 1, right: 10 }}
        />
        <MaxFitnessDisplay maxFitness={maxFitness} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={onMenuOpen}>
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Popover
          open={openMenu}
          anchorEl={anchorEl}
          onClose={onMenuClose}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left'
          }}
        >
          <Stack p={0}>
            <Typography
              color="GrayText"
              sx={{ fontSize: '0.7rem', textAlign: 'right' }}
            >
              {date.toLocaleString()}
            </Typography>
            <Stack direction="row" spacing={2} mb={1}>
              <Button
                onClick={(event) => {
                  onDuplicate(event, id)
                }}
                startIcon={<ContentCopyIcon fontSize="small" />}
                size="small"
                color="inherit"
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              >
                Copy
              </Button>
              <Button
                onClick={onDelete}
                startIcon={<DeleteIcon fontSize="small" />}
                size="small"
                color="error"
                variant="outlined"
                sx={{ justifyContent: 'flex-start' }}
              >
                Delete
              </Button>
            </Stack>
            <SimulationSummary simulation={simulation} />
          </Stack>
        </Popover>
      </Stack>
    </Paper>
  )
}

export default SimulationEntry
