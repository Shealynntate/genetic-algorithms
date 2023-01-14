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
  onCheck,
  onDelete,
  onSelect,
  color,
  isSelected,
  status,
}) {
  const theme = useTheme();
  const hasCheckbox = status !== SimulationStatus.PENDING;
  const hasDelete = status !== SimulationStatus.RUNNING;
  const elevation = isSelected ? 8 : 2;

  return (
    <Paper elevation={elevation} sx={{ px: 1 }} onClick={() => onSelect(id)}>
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
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func,
  color: PropTypes.string,
};

SimulationEntry.defaultProps = {
  isChecked: false,
  isSelected: false,
  onCheck: () => {},
  onDelete: () => {},
  onSelect: () => {},
  color: null,
};

export default SimulationEntry;
