import { Stack, Typography } from '@mui/material'

function Footer(): JSX.Element {
  return (
    <Stack sx={{ p: 2, alignItems: 'center' }}>
      <Typography variant="caption" color="text.secondary">
        &copy; 2026 Blob Ross &middot; Shealyn Hindenlang
      </Typography>
    </Stack>
  )
}

export default Footer
