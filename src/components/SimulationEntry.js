import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import {
  Checkbox,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { SimulationStatus } from '../constants';

function SimulationEntry({
  id,
  createdOn,
  name,
  isChecked,
  onClick,
  onDelete,
  color,
  status,
}) {
  const theme = useTheme();
  const hasCheckbox = status !== SimulationStatus.PENDING;
  const hasDelete = status !== SimulationStatus.RUNNING;

  return (
    <Paper elevation={2} sx={{ px: 1 }}>
      <Stack direction="row">
        {hasCheckbox && (
          <Checkbox
            checked={isChecked}
            onClick={(event) => onClick(event, id)}
            sx={{
              color: color || theme.palette.primary.main,
              '&.Mui-checked': {
                color: color || theme.palette.primary.main,
              },
            }}
          />
        )}
        <Typography variant="body2" pr={1}>{`${id}. ${name}`}</Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {new Date(createdOn).toLocaleString()}
        </Typography>
        {hasDelete && (
          <IconButton color="error" onClick={() => onDelete(id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}

SimulationEntry.propTypes = {
  id: PropTypes.number.isRequired,
  createdOn: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  color: PropTypes.string,
};

SimulationEntry.defaultProps = {
  isChecked: false,
  onClick: () => {},
  onDelete: () => {},
  color: null,
};

export default SimulationEntry;
