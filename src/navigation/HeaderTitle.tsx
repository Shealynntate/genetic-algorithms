import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

import { NavPaths, SiteTitle } from './config'
import DNAImage from '../assets/DNA.png'

function HeaderTitle(): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const iconSize = isMobile ? 22 : 28

  return (
    <Link to={NavPaths.home} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <img src={DNAImage} alt="DNA Helix" width={iconSize} height={iconSize} />
        <Typography
          variant={isMobile ? 'body1' : 'h5'}
          sx={{ fontWeight: 700, color: theme.palette.text.primary }}
        >
          {SiteTitle}
        </Typography>
      </Stack>
    </Link>
  )
}

export default HeaderTitle
