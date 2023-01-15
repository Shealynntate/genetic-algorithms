import { Box, Input, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const SigmaInput = forwardRef(({
  defaultValue,
  label,
  name,
  onBlur,
  onChange,
  readOnly,
}, ref) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <Typography sx={{ pr: 2 }}>{label}</Typography>
    <Input
      defaultValue={defaultValue}
      onBlur={onBlur}
      onChange={onChange}
      name={name}
      ref={ref}
      readOnly={readOnly}
      inputProps={{
        min: 0,
        max: 1,
        step: 0.001,
        type: 'number',
      }}
    />
  </Box>
));

SigmaInput.propTypes = {
  defaultValue: PropTypes.number,
  label: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
};

SigmaInput.defaultProps = {
  defaultValue: 0,
  label: '',
  onBlur: () => {},
  onChange: () => {},
  readOnly: false,
};

export default SigmaInput;
