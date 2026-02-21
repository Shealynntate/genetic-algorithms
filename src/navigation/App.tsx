import React from 'react'
import { Container, Stack } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ErrorSnackbar from '../common/ErrorSnackbar'
import SuccessSnackbar from '../common/SuccessSnackbar'

function App(): JSX.Element {
  return (
    <Stack height="100vh">
      <Header />
      <Container sx={{ mt: 1, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Footer />
      <ErrorSnackbar />
      <SuccessSnackbar />
    </Stack>
  )
}

export default App
