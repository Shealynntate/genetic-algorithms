import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
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
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { addGraphEntry, removeGraphEntry } from '../../features/ux/uxSlice';
import { SimulationStatus } from '../../constants/typeDefinitions';
import { ParametersType } from '../../constants/propTypes';
import { deleteSimulation, renameSimulation } from '../../global/database';
import { useGraphColor, useIsGraphEntry } from '../../features/hooks';
import StatusIcon from './StatusIcon';

function SimulationEntry({
  simulation,
  onDuplicate,
  onSelect,
  isSelected,
}) {
  const {
    id, createdOn, name, status,
  } = simulation;
  const theme = useTheme();
  const dispatch = useDispatch();
  const [nameValue, setNameValue] = useState(name);
  const [anchorEl, setAnchorEl] = useState(null);
  const isChecked = useIsGraphEntry(id);
  const color = useGraphColor(id);
  const isCheckable = status !== SimulationStatus.PENDING;
  const isDeletable = status !== SimulationStatus.RUNNING;
  const isEditable = status !== SimulationStatus.RUNNING;
  const elevation = isSelected ? 0 : 0;
  const border = isSelected ? `1px dashed ${theme.palette.primary.main}` : `0px solid ${theme.palette.divider}}`;
  const date = new Date(createdOn);
  const openMenu = Boolean(anchorEl);

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

  const onMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const onMenuClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <Paper
      elevation={elevation}
      sx={{ py: 1, px: 0, border }}
      onClick={() => onSelect(id)}
    >
      <Stack direction="row" sx={{ position: 'relative' }} spacing={1}>
        <Box>
          <Checkbox
            checked={isChecked}
            disabled={!isCheckable}
            onClick={(event) => onCheck(event, id)}
            sx={{
              color: color || 'inherit',
              '&.Mui-checked': {
                color: color || 'inherit',
              },
            }}
          />
        </Box>
        <Stack sx={{ position: 'relative', flex: 1 }}>
          <TextField
            value={nameValue}
            onChange={onChangeName}
            variant="standard"
            size="small"
            disabled={!isEditable}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '0.25rem' }}>
            <Typography
              color="GrayText"
              sx={{ fontSize: '0.7rem' }}
            >
              {id}
            </Typography>
            <Typography
              color="GrayText"
              sx={{ fontSize: '0.7rem' }}
            >
              {date.toLocaleString()}
            </Typography>
          </Box>
        </Stack>
        <StatusIcon status={status} />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="small" onClick={onMenuOpen}>
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
        </Box>
        <Popover open={openMenu} onClose={onMenuClose} anchorEl={anchorEl}>
          <Stack>
            <Button
              onClick={(event) => onDuplicate(event, id)}
              startIcon={<ContentCopyIcon />}
              size="small"
              color="inherit"
              sx={{ justifyContent: 'flex-start' }}
            >
              Duplicate
            </Button>
            <Button
              onClick={onDelete}
              startIcon={<DeleteIcon />}
              size="small"
              color="error"
              disabled={!isDeletable}
              sx={{ justifyContent: 'flex-start' }}
            >
              Delete
            </Button>
          </Stack>
        </Popover>
      </Stack>
    </Paper>
  );
}

SimulationEntry.propTypes = {
  simulation: PropTypes.shape(ParametersType).isRequired,
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
