/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Box, Input, Typography } from '@mui/material';
import defaultParameters from '../../constants/defaultParameters';
import { ParameterLabels } from '../../constants/websiteCopy';
import Tooltip from '../common/Tooltip';

function SigmaInput({
  path,
  register,
  readOnly,
}) {
  const { text, Icon, tooltip } = _.get(ParameterLabels, path);
  const defaultValue = _.get(defaultParameters, path);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Tooltip content={tooltip} display="flex" direction="left">
        <>
          <Typography variant="body2">{text}</Typography>
          {Icon && <Icon />}
        </>
      </Tooltip>
      <Input
        defaultValue={defaultValue}
        readOnly={readOnly}
        inputProps={{
          min: 0,
          max: 1,
          step: 0.001,
          type: 'number',
        }}
        sx={{ ml: 2 }}
        {...register(path, { valueAsNumber: true })}
      />
    </Box>
  );
}

SigmaInput.propTypes = {
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

SigmaInput.defaultProps = {
  readOnly: false,
};

export default SigmaInput;
