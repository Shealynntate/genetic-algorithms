import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Container } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { selectIsAuthenticated } from '../navigation/navigationSlice'
import AuthForm from './AuthForm'
import SignOut from './SignOut'

function Admin(): JSX.Element {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <Container>
      <Button href="/" startIcon={<ArrowBackIcon />}>
        Back
      </Button>
      <Container maxWidth="sm">
        {isAuthenticated ? (
          <SignOut sx={{ mt: 2 }} />
        ) : (
          <AuthForm sx={{ mt: 2 }} />
        )}
      </Container>
    </Container>
  )
}
export default Admin
