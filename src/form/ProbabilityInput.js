/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Box, Input, Stack, Typography,
} from '@mui/material';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import defaultParameters, { ParameterBounds } from '../parameters/config';
import { ParameterLabels } from '../constants/websiteCopy';
import Tooltip from '../../common/Tooltip';

// Note: Start and End fitness are available as inputs here, currently not setting them
function ProbabilityInput({
  hide,
  path,
  register,
  readOnly,
}) {
  const { min, max, step } = _.get(ParameterBounds, path);
  const { text, Icon, tooltip } = _.get(ParameterLabels, path);
  const {
    startValue,
    endValue,
    startFitness,
    endFitness,
  } = _.get(defaultParameters, path);

  return (
    <Box sx={{ display: hide ? 'none' : 'flex', height: 'fit-content' }}>
      <Tooltip content={tooltip} display="flex">
        <>
          <Typography variant="body2">{text}</Typography>
          {Icon && <Icon />}
        </>
      </Tooltip>
      <Stack sx={{ textAlign: 'center', pl: 2 }}>
        <Input
          defaultValue={startValue}
          readOnly={readOnly}
          {...register(`${path}.startValue`, { valueAsNumber: true })}
          inputProps={{
            min,
            max,
            step,
            type: 'number',
          }}
        />
        <Input
          defaultValue={startFitness}
          readOnly={readOnly}
          {...register(`${path}.startFitness`, { valueAsNumber: true })}
          inputProps={{
            min: 0,
            max: 1,
            step: 0.001,
            type: 'number',
          }}
          disableUnderline
          sx={{ display: 'none' }}
        />
      </Stack>
      <Stack sx={{ justifyContent: 'center' }}>
        <DoubleArrowIcon fontSize="small" />
      </Stack>
      <Stack>
        <Input
          defaultValue={endValue}
          readOnly={readOnly}
          {...register(`${path}.endValue`, { valueAsNumber: true })}
          inputProps={{
            min: 0,
            max: 1,
            step: 0.0001,
            type: 'number',
          }}
        />
        <Input
          defaultValue={endFitness}
          readOnly={readOnly}
          {...register(`${path}.endFitness`, { valueAsNumber: true })}
          inputProps={{
            min: 0,
            max: 1,
            step: 0.001,
            type: 'number',
          }}
          disableUnderline
          sx={{ display: 'none' }}
        />
      </Stack>
    </Box>
  );
}

ProbabilityInput.propTypes = {
  hide: PropTypes.bool,
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

ProbabilityInput.defaultProps = {
  hide: false,
  readOnly: false,
};

export default ProbabilityInput;
