import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import theme from '../theme';

const ErrorTooltip = styled(({
  error,
  children,
  direction,
  display,
  show,
}) => {
  if (!error) {
    // Don't create the tooltip if there's no text content
    return children;
  }

  return (
    <Box
      style={{ display: 'inherit', position: 'relative' }}
    >
      {children}
      {show && (
        <div
          className={`Tooltip-Tip ${direction}`}
          style={{
            display,
            position: 'absolute',
            lineHeight: 1.3,
            zIndex: 9999,
            whiteSpace: 'pre',
            overflowX: 'visible',
            color: theme.palette.error.light,
            background: theme.palette.background.paper,
          }}
        >
          {error}
        </div>
      )}
    </Box>
  );
})();

ErrorTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.string,
  display: PropTypes.string,
  error: PropTypes.node,
  show: PropTypes.bool,
};

ErrorTooltip.defaultProps = {
  direction: 'bottom',
  display: 'block',
  error: null,
  show: false,
};

export default ErrorTooltip;
