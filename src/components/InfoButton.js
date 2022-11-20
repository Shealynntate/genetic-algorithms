import React from 'react';
import PropTypes from 'prop-types';
import { Fab, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function InfoButton({ message }) {
  return (
    <Tooltip title={message}>
      <Fab color="primary" size="extrasmall">
        <InfoOutlinedIcon />
      </Fab>
    </Tooltip>
  );
}

InfoButton.propTypes = {
  message: PropTypes.string.isRequired,
};

export default InfoButton;
