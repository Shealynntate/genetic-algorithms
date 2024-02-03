import React from 'react'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import ErrorSnackbar from '../common/ErrorSnackbar'
import SuccessSnackbar from '../common/SuccessSnackbar'

function App (): JSX.Element {
  return (
    <div>
      <Header />
      <Container sx={{ mt: 1 }}>
        <Outlet />
      </Container>
      <ErrorSnackbar />
      <SuccessSnackbar />
    </div>
  )
}

export default App
