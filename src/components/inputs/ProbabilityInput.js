import {
  Box, Checkbox, Input, Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { forwardRef, useState } from 'react';
import { MutationProbabilityLabels } from '../../constants';

const ProbabilityInput = forwardRef(({
  defaultValue,
  type,
  name,
  onBlur,
  onChange,
}, ref) => {
  const [checked, setChecked] = useState(false);

  const onCheckedChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Checkbox checked={checked} onChange={onCheckedChange} />
      <Typography>{MutationProbabilityLabels[type]}</Typography>
      <Input
        defaultValue={defaultValue}
        onBlur={onBlur}
        onChange={onChange}
        name={name}
        ref={ref}
        disabled={!checked}
        inputProps={{
          min: 0,
          max: 1,
          step: 0.001,
          type: 'number',
        }}
      />
    </Box>
  );
});

ProbabilityInput.propTypes = {
  defaultValue: PropTypes.number,
  type: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
};

ProbabilityInput.defaultProps = {
  defaultValue: 0,
  onBlur: () => {},
  onChange: () => {},
};

export default ProbabilityInput;
