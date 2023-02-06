import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';

function Keyword({ children }) {
  const theme = useTheme();

  return (
    <span style={{
      paddingRight: '0.4rem',
      paddingLeft: '0.4rem',
      // fontStyle: 'italic',
      color: theme.palette.secondary.main,
    }}
    >
      {children}
    </span>
  );
}

Keyword.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Keyword;
