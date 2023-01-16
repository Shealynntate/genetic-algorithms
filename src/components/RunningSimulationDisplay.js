import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Paper, Stack, Typography,
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { ParametersType } from '../types';
import SimulationEntry from './SimulationEntry';
import { canvasParameters, SimulationStatus } from '../constants';
import GlobalBest from './GlobalBest';
import Canvas from './Canvas';
import { createImageData } from '../globals/utils';
import Panel from './settingsPanels/Panel';

const { width, height } = canvasParameters;

function RunningSimulationDisplay({
  color,
  isChecked,
  isSelected,
  onCheck,
  onDuplicate,
  onSelect,
  simulation,
}) {
  const target = useSelector((state) => state.parameters.population.target);
  const [imageData, setImageData] = useState();
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    const updateImage = async () => {
      const result = await createImageData(target);
      if (isMounted) {
        setImageData(result);
      }
    };
    updateImage();

    return () => {
      isMounted = false;
    };
  }, [target]);
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
          <Canvas width={width} height={height} imageData={imageData} />
        </Stack>
        <Stack>
          <Typography variant="caption" pt={1}>Current Best</Typography>
          <GlobalBest />
        </Stack>
      </Stack>
      <SimulationEntry
        simulation={simulation}
        status={SimulationStatus.RUNNING}
        isChecked={isChecked}
        isSelected={isSelected}
        onCheck={onCheck}
        onDuplicate={onDuplicate}
        onSelect={onSelect}
        color={color}
      />
    </Panel>
  );
}

RunningSimulationDisplay.propTypes = {
  color: PropTypes.string,
  isChecked: PropTypes.bool,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  simulation: PropTypes.shape(ParametersType),
};

RunningSimulationDisplay.defaultProps = {
  color: null,
  isChecked: false,
  isSelected: false,
  onCheck: () => {},
  onDuplicate: () => {},
  onSelect: () => {},
  simulation: null,
};

export default RunningSimulationDisplay;
