import React from 'react'
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { SiteTitle } from './config'
import DNAImage from '../assets/DNA.png'

function HeaderTitle (): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const iconSize = isMobile ? 22 : 28

  return (
    <Stack direction='row' spacing='1' sx={{ alignItems: 'baseline' }}>
      <img src={DNAImage} alt='DNA Helix' width={iconSize} height={iconSize} />
      <Typography variant={ isMobile ? 'body1' : 'h5'}>
        {SiteTitle}
      </Typography>
    </Stack>
  )
}

export default HeaderTitle
