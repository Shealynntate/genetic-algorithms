import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import {
  Checkbox,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { SimulationStatus } from '../../constants';
import { deleteSimulation, renameSimulation } from '../../globals/database';
import { ParametersType } from '../../types';

function SimulationEntry({
  simulation,
  isChecked,
  onCheck,
  onDuplicate,
  onSelect,
  color,
  isSelected,
  status,
}) {
  const { id, createdOn, name } = simulation;
  const theme = useTheme();
  const [nameValue, setNameValue] = useState(name);
  const hasCheckbox = status !== SimulationStatus.PENDING;
  const hasDelete = status !== SimulationStatus.RUNNING;
  const elevation = isSelected ? 2 : 2;
  const border = isSelected ? `1px dashed ${theme.palette.primary.main}` : 'none';

  const onDelete = (event) => {
    event.stopPropagation();
    deleteSimulation(id);
  };

  const onChangeName = async (event) => {
    const { value } = event.target;
    setNameValue(value);
    await renameSimulation(id, value);
  };

  return (
    <Paper
      elevation={elevation}
      sx={{ p: 1, border }}
      onClick={() => onSelect(id)}
    >
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
        <Typography variant="body2" pr={1}>{`${id}.`}</Typography>
        <TextField
          value={nameValue}
          onChange={onChangeName}
          variant="standard"
        />
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {new Date(createdOn).toLocaleString()}
        </Typography>
        <IconButton onClick={(event) => onDuplicate(event, id)}>
          <ContentCopyIcon />
        </IconButton>
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
  simulation: PropTypes.shape(ParametersType).isRequired,
  status: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
  isSelected: PropTypes.bool,
  onCheck: PropTypes.func,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  color: PropTypes.string,
};

SimulationEntry.defaultProps = {
  isChecked: false,
  isSelected: false,
  onCheck: () => {},
  onDuplicate: () => {},
  onSelect: () => {},
  color: null,
};

export default SimulationEntry;
