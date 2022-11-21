/* eslint-disable react/jsx-props-no-spreading */
import { useTheme } from '@emotion/react';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { canvasParameters } from '../constants';
import { setTarget } from '../features/metadataSlice';
import { createImageData, fileToBase64 } from '../utils';
import Canvas from './Canvas';

const { width, height } = canvasParameters;

function ImageInput() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const target = useSelector((state) => state.metadata.target);
  const [imageData, setImageData] = useState();

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
      console.log(acceptedFiles);
      const data = await fileToBase64(acceptedFiles[0]);
      dispatch(setTarget(data));
    },
    onDropRejected: (rejectedFiles) => {
      console.log('rejected', rejectedFiles);
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
    </Box>
  );
}

export default ImageInput;
