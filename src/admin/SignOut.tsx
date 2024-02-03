import React from 'react'
import { Paper, Typography, type SxProps, Button } from '@mui/material'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebase'

interface SignOutProps {
  sx?: SxProps
}

function SignOut ({ sx }: SignOutProps): JSX.Element {
  const onSignOut = async (): Promise<void> => {
    await signOut(auth)
  }

  const handleClick = (): void => {
    onSignOut().catch(console.error)
  }

  return (
    <Paper component='form' sx={{ p: 2, textAlign: 'center', ...sx }}>
      <Typography variant='h3' mb={2}>
        Admin Logout
      </Typography>
      <Button variant='contained' onClick={handleClick}>
        Sign Out
      </Button>
    </Paper>
  )
}

export default SignOut
