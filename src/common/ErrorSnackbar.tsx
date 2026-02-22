import { Alert, Snackbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import {
  closeErrorSnackbar,
  selectErrorSnackbarMessage,
  selectErrorSnackbarOpen
} from '../navigation/navigationSlice'

function ErrorSnackbar(): JSX.Element {
  const isOpen = useSelector(selectErrorSnackbarOpen)
  const message = useSelector(selectErrorSnackbarMessage)
  const dispatch = useDispatch()

  const onClose = (): void => {
    dispatch(closeErrorSnackbar())
  }

  return (
    <Snackbar open={isOpen} onClose={onClose}>
      <Alert severity="error" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default ErrorSnackbar
