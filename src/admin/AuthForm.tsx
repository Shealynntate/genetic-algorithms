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

interface AuthFormProps {
  sx?: SxProps
}

function AuthForm ({ sx }: AuthFormProps): JSX.Element {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const onSubmit = async (): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const handleClick = (event: SyntheticEvent): void => {
    onSubmit().catch(console.error)
  }

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value)
  }

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value)
  }

  return (
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
  )
}

export default AuthForm
