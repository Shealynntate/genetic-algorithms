import { Alert, Snackbar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import {
  closeSuccessSnackbar,
  selectSuccessSnackbarMessage,
  selectSuccessSnackbarOpen
} from '../navigation/navigationSlice'

function SuccessSnackbar(): JSX.Element {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectSuccessSnackbarOpen)
  const message = useSelector(selectSuccessSnackbarMessage)

  const onClose = (): void => {
    dispatch(closeSuccessSnackbar())
  }

  return (
    <Snackbar open={isOpen} onClose={onClose} autoHideDuration={6_000}>
      <Alert severity="success" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SuccessSnackbar
