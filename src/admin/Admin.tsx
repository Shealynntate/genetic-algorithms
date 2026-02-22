import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Button, Container } from '@mui/material'
import { useSelector } from 'react-redux'

import AuthForm from './AuthForm'
import SignOut from './SignOut'
import { selectIsAuthenticated } from '../navigation/navigationSlice'

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
