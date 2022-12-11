import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import OrganismCanvas from './OrganismCanvas';
import { canvasParameters } from '../constants';
import ImageCaption from './ImageCaption';

const { width, height } = canvasParameters;

function GlobalBest() {
  const theme = useTheme();
  const globalBest = useSelector((state) => state.metadata.globalBest);

  return (
    <div>
      <Typography pb={1}>All Time Best</Typography>
      {globalBest ? (
        <>
          <OrganismCanvas organism={globalBest.organism} />
          <ImageCaption gen={globalBest.genId} fitness={globalBest.organism.fitness} />
        </>
      ) : (
        <Box sx={{
          flex: '1 1 auto',
          minWidth: width,
          padding: theme.spacing(1),
          paddingTop: 0,
        }}
        >
          <Box sx={{
            display: 'flex',
            height: `${height}px`,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.disabled,
          }}
          >
            <Typography>Waiting for data</Typography>
          </Box>
        </Box>
      )}
    </div>
  );
}

export default memo(GlobalBest);
