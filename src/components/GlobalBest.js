import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import OrganismCanvas from './OrganismCanvas';
import { canvasParameters } from '../constants';

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption">
              {`Gen: ${globalBest.id}`}
            </Typography>
            <Typography variant="caption">
              {`Score: ${globalBest.organism.fitness.toFixed(3)}`}
            </Typography>
          </Box>
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
