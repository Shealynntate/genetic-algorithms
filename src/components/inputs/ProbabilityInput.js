/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Box, Input, Stack, Typography,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PropTypes from 'prop-types';

function ProbabilityInput({
  defaultValues,
  label,
  path,
  register,
  readOnly,
}) {
  const {
    startValue, endValue, startFitness, endFitness,
  } = defaultValues;
  return (
    <Box sx={{ display: 'flex' }}>
      <Typography sx={{ pr: 2 }}>{label}</Typography>
      <Stack sx={{ textAlign: 'center' }}>
        <Input
          defaultValue={startValue}
          readOnly={readOnly}
          {...register(`${path}.startValue`, { valueAsNumber: true })}
          inputProps={{
            min: 0,
            max: 1,
            step: 0.0001,
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
        />
      </Stack>
      <Stack sx={{ justifyContent: 'center' }}>
        <CasinoIcon color="disabled" fontSize="small" />
        <FitnessCenterIcon color="disabled" fontSize="small" />
      </Stack>
    </Box>
  );
}

ProbabilityInput.propTypes = {
  defaultValues: PropTypes.objectOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

ProbabilityInput.defaultProps = {
  readOnly: false,
};

export default ProbabilityInput;
