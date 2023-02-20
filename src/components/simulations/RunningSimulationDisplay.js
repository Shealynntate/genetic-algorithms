import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper, Stack, Typography,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { ParametersType } from '../../types';
import SimulationEntry from './SimulationEntry';
import { canvasParameters, SimulationStatus } from '../../constants';
import GlobalBest from '../GlobalBest';
import Panel from '../common/Panel';
import TargetCanvas from '../Canvases/TargetCanvas';

const { width, height } = canvasParameters;

function RunningSimulationDisplay({
  isSelected,
  onDuplicate,
  onSelect,
  simulation,
}) {
  const target = useSelector((state) => state.parameters.population.target);
  const theme = useTheme();

  if (!simulation) {
    return (
      <Paper sx={{ textAlign: 'center' }}>
        <Typography sx={{ color: theme.palette.text.disabled }}>
          Create a new simulation and watch it run!
        </Typography>
      </Paper>
    );
  }

  return (
    <Panel label="In Progress">
      <Stack direction="row" spacing={1}>
        <Stack>
          <Typography variant="caption" pt={1}>Target</Typography>
          <TargetCanvas width={width} height={height} target={target} />
        </Stack>
        <Stack>
          <Typography variant="caption" pt={1}>Current Best</Typography>
          <GlobalBest />
        </Stack>
      </Stack>
      <SimulationEntry
        simulation={simulation}
        status={SimulationStatus.RUNNING}
        isSelected={isSelected}
        onDuplicate={onDuplicate}
        onSelect={onSelect}
      />
    </Panel>
  );
}

RunningSimulationDisplay.propTypes = {
  isSelected: PropTypes.bool,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  simulation: PropTypes.shape(ParametersType),
};

RunningSimulationDisplay.defaultProps = {
  isSelected: false,
  onDuplicate: () => {},
  onSelect: () => {},
  simulation: null,
};

export default RunningSimulationDisplay;
