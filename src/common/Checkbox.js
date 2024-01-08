import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Stack, Typography } from '@mui/material';

function CustomCheckbox({ label, checked, onCheck }) {
  const onClick = (event) => {
    event.stopPropagation();
    onCheck(!checked);
  };

  return (
    <Stack direction="row" sx={{ alignItems: 'end' }}>
      <Checkbox
        size="small"
        sx={{ pb: 0 }}
        checked={checked}
        onClick={(event) => onClick(event)}
      />
      <Typography variant="body2">{label}</Typography>
    </Stack>
  );
}

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onCheck: PropTypes.func,
};

CustomCheckbox.defaultProps = {
  label: '',
  checked: false,
  onCheck: () => {},
};

export default CustomCheckbox;
