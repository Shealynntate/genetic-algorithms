import React from 'react';
import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mui/material';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RunCircleOutlinedIcon from '@mui/icons-material/RunCircleOutlined';
import PauseCircleOutlineOutlinedIcon from '@mui/icons-material/PauseCircleOutlineOutlined';
import { SimulationStatus } from '../../constants/typeDefinitions';

// TODO: Add PAUSED status?
const statusIconMap = {
  [SimulationStatus.PENDING]: {
    icon: <PendingOutlinedIcon color="inherit" />,
    tooltip: 'Pending',
  },
  [SimulationStatus.RUNNING]: {
    icon: <RunCircleOutlinedIcon color="info" />,
    tooltip: 'Running',
  },
  [SimulationStatus.PAUSED]: {
    icon: <PauseCircleOutlineOutlinedIcon color="warning" />,
    tooltip: 'Paused',
  },
  [SimulationStatus.COMPLETE]: {
    icon: <CheckCircleOutlineOutlinedIcon color="success" />,
    tooltip: 'Completed',
  },
};

function StatusIcon({ status, sx }) {
  const data = statusIconMap[status];
  return (
    <Tooltip title={data.tooltip}>
      <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
        {data.icon}
      </Box>
    </Tooltip>
  );
}

StatusIcon.propTypes = {
  status: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  sx: PropTypes.objectOf(PropTypes.any),
};

StatusIcon.defaultProps = {
  sx: {},
};

export default StatusIcon;
