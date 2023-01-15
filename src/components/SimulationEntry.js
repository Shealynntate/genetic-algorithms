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
import { deleteSimulation } from '../globals/database';

function SimulationEntry({
  id,
  createdOn,
  name,
  isChecked,
  onCheck,
  onSelect,
  color,
  isSelected,
  status,
}) {
  const theme = useTheme();
  const hasCheckbox = status !== SimulationStatus.PENDING;
  const hasDelete = status !== SimulationStatus.RUNNING;
  const elevation = isSelected ? 8 : 2;

  const onDelete = (event) => {
    event.stopPropagation();
    deleteSimulation(id);
  };

  return (
    <Paper elevation={elevation} sx={{ p: 1 }} onClick={() => onSelect(id)}>
      <Stack direction="row" sx={{ alignItems: 'center' }}>
        {hasCheckbox && (
          <Checkbox
            checked={isChecked}
            onClick={(event) => onCheck(event, id)}
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
          <IconButton color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}

SimulationEntry.propTypes = {
  id: PropTypes.number.isRequired,
  createdOn: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onSelect: PropTypes.func,
  color: PropTypes.string,
};

SimulationEntry.defaultProps = {
  isChecked: false,
  isSelected: false,
  onCheck: () => {},
  onSelect: () => {},
  color: null,
};

export default SimulationEntry;
