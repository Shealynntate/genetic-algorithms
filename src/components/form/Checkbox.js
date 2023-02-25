/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Stack, Typography } from '@mui/material';
import _ from 'lodash';
import defaultParameters from '../../constants/defaultParameters';
import { ParameterLabels } from '../../constants/websiteCopy';
import Tooltip from '../common/Tooltip';

function CustomCheckbox({
  path,
  register,
  readOnly,
}) {
  const { text, Icon, tooltip } = _.get(ParameterLabels, path);
  const defaultValue = _.get(defaultParameters, path);

  return (
    <Stack direction="row" sx={{ alignItems: 'end', pb: 1 }}>
      <Checkbox
        size="small"
        sx={{ pb: 0, pr: 0.5 }}
        defaultChecked={defaultValue}
        readOnly={readOnly}
        {...register(path)}
      />
      <Tooltip content={tooltip} direction="left">
        {Icon && <Icon />}
        <Typography variant="body2">{text}</Typography>
      </Tooltip>
    </Stack>
  );
}

CustomCheckbox.propTypes = {
  path: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

CustomCheckbox.defaultProps = {
  readOnly: false,
};

export default CustomCheckbox;
