import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@mui/material';
import { Box } from '@mui/system';
import useMousePosition from './useMousePosition';

const buffer = [3 * 16, 16];

function HoverPopover({
  open, children, anchorEl, onClose, anchorOrigin, transformOrigin,
}) {
  const mousePosition = useMousePosition();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current == null) return;

    const b = buffer;
    const { x, y } = mousePosition;
    const {
      top, left, right, bottom,
    } = ref.current.getBoundingClientRect();
    // If inside the anchor plus a small buffer around the rect, don't close
    if (x > left - b[0] && x < right + b[0] && y > top - b[1] && y < bottom + b[1]) {
      return;
    }

    onClose();
  }, [mousePosition]);

  return (
    <Popover
      sx={{ p: 0 }}
      anchorEl={anchorEl}
      open={open}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <Box sx={{ p: 1 }} ref={ref}>
        {children}
      </Box>
    </Popover>
  );
}

HoverPopover.propTypes = {
  open: PropTypes.bool,
  children: PropTypes.element.isRequired,
  anchorEl: PropTypes.instanceOf(Element),
  onClose: PropTypes.func,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  }),
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  }),
};

HoverPopover.defaultProps = {
  open: false,
  anchorEl: null,
  onClose: () => {},
  anchorOrigin: {
    vertical: 'center',
    horizontal: 'right',
  },
  transformOrigin: {
    vertical: 'center',
    horizontal: 'left',
  },
};

export default HoverPopover;
