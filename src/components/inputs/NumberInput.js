/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import defaultParameters, { ParameterBounds, ParameterLabels, ParameterValidation } from '../../globals/defaultParameters';

function NumberInput({
  errors,
  getValues,
  path,
  register,
  readOnly,
}) {
  const defaultValue = _.get(defaultParameters, path);
  const { min, max, step } = _.get(ParameterBounds, path);
  const validate = _.get(ParameterValidation, path, () => {});
  const error = _.get(errors, path);

  return (
    <Stack direction="row">
      <Tooltip title={error?.message} arrow open={!!error}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <Typography pr={1}>{_.get(ParameterLabels, path)}</Typography>
          <Input
            defaultValue={defaultValue}
            {...register(path, { valueAsNumber: true, validate: (v) => validate(v, getValues) })}
            readOnly={readOnly}
            inputProps={{
              min,
              max,
              step,
              type: 'number',
            }}
          />
        </Stack>
      </Tooltip>
    </Stack>
  );
}

NumberInput.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object.isRequired,
  getValues: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

NumberInput.defaultProps = {
  readOnly: false,
};

export default NumberInput;
