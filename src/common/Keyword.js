import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';

function Keyword({ pl, pr, children }) {
  const theme = useTheme();

  return (
    <span style={{
      paddingLeft: pl,
      paddingRight: pr,
      color: theme.palette.secondary.main,
    }}
    >
      {children}
    </span>
  );
}

Keyword.propTypes = {
  children: PropTypes.node.isRequired,
  pl: PropTypes.string,
  pr: PropTypes.string,
};

Keyword.defaultProps = {
  pl: '0.4rem',
  pr: '0.4rem',
};

export default Keyword;
