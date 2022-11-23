/* eslint-disable react/jsx-props-no-spreading */
import { useTheme } from '@emotion/react';
import { Alert, Box, Snackbar } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { canvasParameters } from '../constants';
import { setTarget } from '../features/metadataSlice';
import { createImageData, fileToBase64 } from '../utils';
import Canvas from './Canvas';

const { width, height } = canvasParameters;

const AlertState = {
  error: 'error',
  info: 'info',
  success: 'success',
  warning: 'warning',
};

const AlertMessage = {
  error: 'Oops, unable to read the file provided',
  warning: 'Only single, image files (.png, .jpg, .jpeg) are accepted',
};

function ImageInput() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const target = useSelector((state) => state.metadata.target);
  const [imageData, setImageData] = useState();
  const [alertState, setAlertState] = useState();

  const updateImage = async () => {
    setImageData(await createImageData(target));
  };

  useEffect(() => {
    updateImage();
    // TODO: Clean-up async call in return?
  }, [target]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        try {
          const data = await fileToBase64(acceptedFiles[0]);
          dispatch(setTarget(data));
        } catch (error) {
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
      <Canvas width={width} height={height} imageData={imageData} />
      <Snackbar open={!!alertState} autoHideDuration={6e3} onClose={() => setAlertState()}>
        {alertState && <Alert severity={alertState}>{AlertMessage[alertState]}</Alert>}
      </Snackbar>
    </Box>
  );
}

export default ImageInput;
