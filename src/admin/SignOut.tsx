import { Paper, Typography, type SxProps, Button } from '@mui/material'
import { signOut } from 'firebase/auth'
import { useDispatch } from 'react-redux'

import { auth } from '../firebase/firebase'
import {
  openErrorSnackbar,
  openSuccessSnackbar
} from '../navigation/navigationSlice'

interface SignOutProps {
  sx?: SxProps
}

function SignOut({ sx }: SignOutProps): JSX.Element {
  const dispatch = useDispatch()

  const handleClick = (): void => {
    signOut(auth)
      .then(() => {
        dispatch(openSuccessSnackbar('Successfully signed out'))
      })
      .catch((error) => {
        dispatch(openErrorSnackbar(`Error signing out ${error.message}`))
        console.error('Error signing out', error)
      })
  }

  return (
    <Paper component="form" sx={{ p: 2, textAlign: 'center', ...sx }}>
      <Typography variant="h3" mb={2}>
        Admin Logout
      </Typography>
      <Button variant="contained" onClick={handleClick}>
        Sign Out
      </Button>
    </Paper>
  )
}

export default SignOut
