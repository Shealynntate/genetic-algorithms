/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import { ParameterBounds, ParameterLabels } from '../../globals/defaultParameters';

function NumberInput({
  defaultValue,
  path,
  register,
  readOnly,
}) {
  const { min, max, step } = _.get(ParameterBounds, path);

  return (
    <Stack direction="row">
      <Typography pr={1}>{_.get(ParameterLabels, path)}</Typography>
      <Input
        defaultValue={defaultValue}
        {...register(path, { valueAsNumber: true })}
        readOnly={readOnly}
        inputProps={{
          min,
          max,
          step,
          type: 'number',
        }}
      />
    </Stack>
  );
}

NumberInput.propTypes = {
  defaultValue: PropTypes.number.isRequired,
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

NumberInput.defaultProps = {
  readOnly: false,
};

export default NumberInput;
