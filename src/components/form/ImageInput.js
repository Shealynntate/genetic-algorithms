/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@emotion/react';
import { Alert, Box, Snackbar } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AlertState, canvasParameters } from '../../constants';
import { fileToBase64 } from '../../globals/utils';
import TargetCanvas from '../canvas/TargetCanvas';

const AlertMessage = {
  error: 'Oops, unable to read the file provided',
  warning: 'Only single, image files (.png, .jpg, .jpeg) are accepted',
};

function ImageInput({
  defaultTarget,
  onChange,
  readOnly,
  width,
  height,
}) {
  const theme = useTheme();
  const [target, setTarget] = useState(defaultTarget);
  const [alertState, setAlertState] = useState();

  useEffect(() => {
    // If in readOnly mode, the defaultTarget can change
    if (readOnly && target !== defaultTarget) {
      setTarget(defaultTarget);
    }
  }, [defaultTarget]);

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
      <TargetCanvas width={width} height={height} target={target} />
      <Snackbar open={!!alertState} autoHideDuration={6e3} onClose={() => setAlertState()}>
        {alertState && <Alert severity={alertState}>{AlertMessage[alertState]}</Alert>}
      </Snackbar>
    </Box>
  );
}

ImageInput.propTypes = {
  defaultTarget: PropTypes.string.isRequired,
  height: PropTypes.number,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  width: PropTypes.number,
};

ImageInput.defaultProps = {
  height: canvasParameters.height,
  onChange: () => {},
  readOnly: false,
  width: canvasParameters.width,
};

export default ImageInput;
