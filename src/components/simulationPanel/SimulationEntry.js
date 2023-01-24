import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { addGraphEntry, removeGraphEntry } from '../../features/ux/uxSlice';
import { SimulationStatus } from '../../constants';
import { deleteSimulation, renameSimulation } from '../../globals/database';
import { ParametersType } from '../../types';
import { useGraphColor, useIsGraphEntry } from '../../hooks';

function SimulationEntry({
  simulation,
  onDuplicate,
  onSelect,
  isSelected,
  status,
}) {
  const { id, createdOn, name } = simulation;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [nameValue, setNameValue] = useState(name);
  const isChecked = useIsGraphEntry(id);
  const color = useGraphColor(id);
  const hasCheckbox = status !== SimulationStatus.PENDING;
  const hasDelete = status !== SimulationStatus.RUNNING;
  const hasTextEdit = status !== SimulationStatus.RUNNING;
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

  const onCheck = (event) => {
    event.stopPropagation();
    if (isChecked) {
      dispatch(removeGraphEntry(id));
    } else {
      dispatch(addGraphEntry(id));
    }
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
        {/* <Typography variant="body2" pr={1}>{`${id}.`}</Typography> */}
        <TextField
          value={nameValue}
          onChange={onChangeName}
          variant="standard"
          size="small"
          disabled={!hasTextEdit}
        />
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {new Date(createdOn).toLocaleString()}
        </Typography>
        <IconButton onClick={(event) => onDuplicate(event, id)} size="small">
          <ContentCopyIcon fontSize="inherit" />
        </IconButton>
        {hasDelete && (
          <IconButton color="error" onClick={onDelete} size="small">
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        )}
      </Stack>
    </Paper>
  );
}

SimulationEntry.propTypes = {
  simulation: PropTypes.shape(ParametersType).isRequired,
  status: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
};

SimulationEntry.defaultProps = {
  isSelected: false,
  onDuplicate: () => {},
  onSelect: () => {},
};

export default SimulationEntry;
