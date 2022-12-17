/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useTheme } from '@emotion/react';
import {
  Alert, Box, Snackbar, Typography,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AlertState } from '../constants';
import { rehydrate } from '../store';

const AlertMessage = {
  error: 'Oops, unable to read the file provided',
  warning: 'Only single, image files (.png, .jpg, .jpeg) are accepted',
};

function JsonInput() {
  const theme = useTheme();
  const [alertState, setAlertState] = useState();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/json': ['.json'],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        try {
          const data = JSON.parse(acceptedFiles[0]);
          rehydrate(data);
        } catch (error) {
          console.log('ERROR', error);
          setAlertState(AlertState.error);
        }
      }
    },
    onDropRejected: () => {
      setAlertState(AlertState.warning);
    },
    maxFiles: 1,
  });

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        width: 'fit-content',
        margin: 'auto',
        p: 1,
        lineHeight: 0,
        border: `1px dashed ${theme.palette.grey[600]}`,
      }}
    >
      <input {...getInputProps()} />
      <Typography>Drop Json file here</Typography>
      <Snackbar open={!!alertState} autoHideDuration={6e3} onClose={() => setAlertState()}>
        {alertState && <Alert severity={alertState}>{AlertMessage[alertState]}</Alert>}
      </Snackbar>
    </Box>
  );
}

export default JsonInput;
