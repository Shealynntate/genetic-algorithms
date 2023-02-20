import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material';

function ExampleText({ children }) {
  const theme = useTheme();

  return (
    <span
      style={{
        display: 'inline',
        paddingLeft: '0.4rem',
        color: theme.palette.primary.light,
      }}
    >
      {children}
    </span>
  );
}

ExampleText.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ExampleText;
