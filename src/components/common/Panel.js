import React from 'react';
import PropTypes from 'prop-types';
import {
  Box, Paper, Typography, useTheme,
} from '@mui/material';

function SectionTitle({ children, variant }) {
  const theme = useTheme();

  return (
    <Typography
      variant="body2"
      sx={{
        position: 'absolute',
        top: '0.25rem',
        left: '0.75rem',
        pr: 0.5,
        background: 'inherit',
        color: theme.palette[variant].dark,
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  );
}

SectionTitle.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string.isRequired,
};

function Panel({
  label,
  children,
  variant,
  pt,
  px,
  pb,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'relative', p: '0.8rem', mb: 1, // background: '#3b3b3e',
      }}
    >
      {label && <SectionTitle variant={variant}>{label}</SectionTitle>}
      <Box sx={{
        border: `1px solid ${theme.palette[variant].dark}`,
        borderRadius: `${theme.shape.borderRadius}px`,
        pt,
        px,
        pb,
      }}
      >
        {children}
      </Box>
    </Paper>
  );
}

Panel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  pt: PropTypes.number,
  px: PropTypes.number,
  pb: PropTypes.number,
};

Panel.defaultProps = {
  label: null,
  variant: 'primary',
  pt: 1.5,
  px: 1,
  pb: 1,
};

export default Panel;
