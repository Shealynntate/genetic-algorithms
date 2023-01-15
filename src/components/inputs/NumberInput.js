/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Input, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import defaultParameters, { ParameterBounds, ParameterLabels } from '../../globals/defaultParameters';

function NumberInput({ path, register }) {
  const { min, max, step } = _.get(ParameterBounds, path);

  return (
    <Stack direction="row">
      <Typography pr={1}>{_.get(ParameterLabels, path)}</Typography>
      <Input
        defaultValue={_.get(defaultParameters, path)}
        {...register(path, { valueAsNumber: true })}
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
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
};

export default NumberInput;
