import React, { type ChangeEvent, useState, type SyntheticEvent } from 'react'
import {
  Button,
  Paper,
  Stack,
  type SxProps,
  TextField,
  Typography
} from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase/firebase'
import { useDispatch } from 'react-redux'
import { openErrorSnackbar, openSuccessSnackbar } from '../navigation/navigationSlice'
import { useNavigate } from 'react-router-dom'
import { NavPaths } from '../navigation/types'

interface AuthFormProps {
  sx?: SxProps
}

function AuthForm ({ sx }: AuthFormProps): JSX.Element {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false)

  const handleClick = (event: SyntheticEvent): void => {
    setIsAuthenticating(true)
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setIsAuthenticating(false)
        dispatch(openSuccessSnackbar('Successfully logged in!'))
        navigate(NavPaths.gallery)
      })
      .catch((error) => {
        setIsAuthenticating(false)
        dispatch(openErrorSnackbar(`Problem signing in: ${error.message}`))
        console.error(error)
      })
  }

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value)
  }

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value)
  }

  return (
    <>
      <Paper component='form' sx={{ p: 2, ...sx }}>
        <Stack spacing={2}>
          <Typography variant='h3' sx={{ textAlign: 'center' }}>
            Admin Login
          </Typography>
          <TextField
            id='email'
            label='Email'
            type='email'
            variant='outlined'
            onChange={onChangeEmail}
            required
          />
          <TextField
            id='password'
            label='Password'
            type='password'
            variant='outlined'
            onChange={onChangePassword}
            required
          />
          <Button variant='contained' onClick={handleClick}>
            Login
          </Button>
        </Stack>
      </Paper>
      {isAuthenticating && (
        <Typography sx={{ textAlign: 'center', mt: 1 }}>
          Authenticating...
        </Typography>
      )}
    </>
  )
}

export default AuthForm
