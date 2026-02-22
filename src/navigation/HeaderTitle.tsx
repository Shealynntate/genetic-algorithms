import PaletteIcon from '@mui/icons-material/Palette'
import { Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Link } from 'react-router-dom'

import { NavPaths, SiteTitle } from './config'

function HeaderTitle(): JSX.Element {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Link to={NavPaths.home} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <PaletteIcon
          sx={{
            fontSize: isMobile ? 22 : 28,
            color: theme.palette.primary.main
          }}
        />
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
