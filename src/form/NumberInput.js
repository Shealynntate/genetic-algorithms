/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Input,
  Stack,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import defaultParameters, { ParameterBounds, ParameterValidation } from '../parameters/config';
import { ParameterLabels } from '../constants/websiteCopy';
import Tooltip from '../../common/Tooltip';
import ErrorTooltip from '../common/ErrorTooltip';

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
  const { text, tooltip } = _.get(ParameterLabels, path);

  return (
    <Stack direction="row">
      <ErrorTooltip error={error?.message} show={!!error}>
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
        >
          <Tooltip content={tooltip}>
            <Typography pr={1}>{text}</Typography>
          </Tooltip>
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
      </ErrorTooltip>
    </Stack>
  );
}

NumberInput.propTypes = {
  errors: PropTypes.objectOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  getValues: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

NumberInput.defaultProps = {
  readOnly: false,
};

export default NumberInput;
