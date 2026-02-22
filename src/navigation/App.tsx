import { Box, Container, Stack } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from './Footer'
import Header from './Header'
import ErrorSnackbar from '../common/ErrorSnackbar'
import SuccessSnackbar from '../common/SuccessSnackbar'

function App(): JSX.Element {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <Header />
      {isLanding ? (
        <Box sx={{ flexGrow: 1 }}>
          <Outlet />
        </Box>
      ) : (
        <Container sx={{ mt: 3, flexGrow: 1 }}>
          <Outlet />
        </Container>
      )}
      <Footer />
      <ErrorSnackbar />
      <SuccessSnackbar />
    </Stack>
  )
}

export default App
