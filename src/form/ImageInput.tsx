import React, { useEffect, useState } from 'react'
import { Alert, Box, Snackbar, useTheme } from '@mui/material'
import { useDropzone } from 'react-dropzone'
import { type AlertState } from '../navigation/types'
import { canvasParameters } from '../simulation/config'
import { fileToBase64 } from '../utils/fileUtils'
import TargetCanvas from '../canvas/TargetCanvas'

const AlertMessage: Record<AlertState, string> = {
  error: 'Oops, unable to read the file provided',
  warning: 'Only single, image files (.png, .jpg, .jpeg) are accepted',
  info: '',
  success: 'File successfully uploaded'
}

interface ImageInputProps {
  defaultTarget: string
  height?: number
  onChange?: (target: string) => void
  readOnly?: boolean
  width?: number
}

function ImageInput({
  defaultTarget,
  onChange = () => {},
  readOnly = false,
  width = canvasParameters.width,
  height = canvasParameters.height
}: ImageInputProps): JSX.Element {
  const theme = useTheme()
  const [target, setTarget] = useState(defaultTarget)
  const [alertState, setAlertState] = useState<AlertState>('info')

  useEffect(() => {
    // If in readOnly mode, the defaultTarget can change
    if (readOnly && target !== defaultTarget) {
      setTarget(defaultTarget)
    }
  }, [defaultTarget])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles[0]).catch(console.error)
      }
    },
    onDropRejected: () => {
      setAlertState('warning')
    },
    maxFiles: 1,
    disabled: readOnly
  })

  const onDrop = async (acceptedFile: File): Promise<void> => {
    try {
      const data = await fileToBase64(acceptedFile)
      setTarget(data as string)
      onChange(data as string)
    } catch (error) {
      setAlertState('error')
    }
  }

  const onSnackbarClose = (): void => {
    setAlertState('info')
  }

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        width: 'fit-content',
        margin: 'auto',
        p: 1,
        lineHeight: 0,
        border: `1px dashed ${theme.palette.grey[600]}`
      }}
    >
      <input {...getInputProps()} disabled={readOnly} />
      <TargetCanvas width={width} height={height} target={target} />
      <Snackbar
        open={alertState !== 'info'}
        autoHideDuration={6e3}
        onClose={onSnackbarClose}
      >
        <Alert severity={alertState}>{AlertMessage[alertState]}</Alert>
      </Snackbar>
    </Box>
  )
}

export default ImageInput
