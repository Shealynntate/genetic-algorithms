/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Alert, Box, Snackbar } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AlertState, canvasParameters } from '../constants';
import { createImageData, fileToBase64 } from '../globals/utils';
import Canvas from './Canvas';

const { width, height } = canvasParameters;

const AlertMessage = {
  error: 'Oops, unable to read the file provided',
  warning: 'Only single, image files (.png, .jpg, .jpeg) are accepted',
};

function ImageInput({ defaultTarget, onChange, readOnly }) {
  const theme = useTheme();
  const [target, setTarget] = useState(defaultTarget);
  const [imageData, setImageData] = useState();
  const [alertState, setAlertState] = useState();

  useEffect(() => {
    // If in readOnly mode, the defaultTarget can change
    if (readOnly && target !== defaultTarget) {
      setTarget(defaultTarget);
    }
  }, [defaultTarget]);

  useEffect(() => {
    let isMounted = true;
    const updateImage = async () => {
      const result = await createImageData(target);
      if (isMounted) {
        setImageData(result);
      }
    };
    updateImage();

    return () => {
      isMounted = false;
    };
  }, [target]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles[0]) {
        try {
          const data = await fileToBase64(acceptedFiles[0]);
          setTarget(data);
          onChange(data);
        } catch (error) {
          setAlertState(AlertState.error);
        }
      }
    },
    onDropRejected: () => {
      setAlertState(AlertState.warning);
    },
    maxFiles: 1,
    disabled: readOnly,
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
      <input {...getInputProps()} disabled={readOnly} />
      <Canvas width={width} height={height} imageData={imageData} />
      <Snackbar open={!!alertState} autoHideDuration={6e3} onClose={() => setAlertState()}>
        {alertState && <Alert severity={alertState}>{AlertMessage[alertState]}</Alert>}
      </Snackbar>
    </Box>
  );
}

ImageInput.propTypes = {
  defaultTarget: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
};

ImageInput.defaultProps = {
  onChange: () => {},
  readOnly: false,
};

export default ImageInput;
