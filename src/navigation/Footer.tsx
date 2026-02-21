import { Stack, Typography } from '@mui/material'
import React from 'react'

function Footer(): JSX.Element {
  return (
    <Stack direction="row" sx={{ p: 2 }}>
      <Typography variant="caption" color="GrayText">
        &copy; 2024 Shealyn Hindenlang
      </Typography>
    </Stack>
  )
}

export default Footer
