import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Box } from '@mui/material';
import theme from '../../theme';

const Tooltip = styled(({
  content,
  children,
  delay,
  direction,
  display,
}) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  if (!content) {
    // Don't create the tooltip if there's no text content
    return children;
  }

  return (
    <Box
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div
          className={`Tooltip-Tip ${direction}`}
          style={{
            display,
            position: 'absolute',
            lineHeight: 1.3,
            zIndex: 9999,
            whiteSpace: 'pre',
            overflowX: 'visible',
            background: theme.palette.background.paper,
          }}
        >
          {content}
        </div>
      )}
    </Box>
  );
})();

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node,
  delay: PropTypes.number,
  direction: PropTypes.string,
  display: PropTypes.string,
};

Tooltip.defaultProps = {
  delay: 400,
  direction: 'top',
  display: 'block',
  content: null,
};

export default Tooltip;
