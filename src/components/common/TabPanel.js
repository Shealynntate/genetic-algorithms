import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@mui/material';

function TabPanel({
  children,
  className,
  index,
  value,
}) {
  const visible = value === index;

  return (
    <div
      role="tabpanel"
      hidden={!visible}
      aria-labelledby={`tab-panel-${index}`}
      className={className}
    >
      {visible && (
        <Container>
          {children}
        </Container>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

TabPanel.defaultProps = {
  className: null,
  children: null,
};

export default TabPanel;
