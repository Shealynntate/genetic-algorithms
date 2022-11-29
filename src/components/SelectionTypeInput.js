import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SelectionType, SelectionTypeLabels } from '../constants';
import { setSelectionType } from '../features/metadata/metadataSlice';

const label = 'Selection Type';

const types = Object.keys(SelectionType);

function SelectionTypeInput() {
  const type = useSelector((state) => state.metadata.selectionType);
  const dispatch = useDispatch();

  const onChangeSelect = (event) => {
    dispatch(setSelectionType(event.target.value));
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="select-label">{label}</InputLabel>
      <Select
        labelId="select-label"
        label={label}
        onChange={onChangeSelect}
        value={type}
      >
        {types.map((t) => (
          <MenuItem key={t} value={t}>
            {SelectionTypeLabels[t]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default SelectionTypeInput;
