import React from 'react'
import { Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Header from './Header'

function App (): JSX.Element {
  return (
    <div>
      <Header />
      <Container sx={{ mt: 1 }}>
        <Outlet />
      </Container>
    </div>
  )
}

export default App
