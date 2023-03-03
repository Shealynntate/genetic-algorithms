import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Stack, Typography,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { ParametersType } from '../../constants/propTypes';
import SimulationEntry from './SimulationEntry';
import { SimulationStatus } from '../../constants/typeDefinitions';
import { canvasParameters } from '../../constants/constants';
import GlobalBest from '../canvas/GlobalBest';
import Panel from '../common/Panel';
import TargetCanvas from '../canvas/TargetCanvas';

const { width, height } = canvasParameters;

function RunningSimulationDisplay({
  isSelected,
  onDuplicate,
  onSelect,
  simulation,
}) {
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

  const { target } = simulation.parameters.population;

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
