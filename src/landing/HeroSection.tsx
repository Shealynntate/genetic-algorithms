import { useState } from 'react'

import {
  Box,
  Button,
  Card,
  CardMedia,
  Skeleton,
  Stack,
  Typography,
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { NavPaths } from '../navigation/config'
import { useFetchAllExperimentsQuery } from '../navigation/navigationSlice'

function HeroSection(): JSX.Element {
  const theme = useTheme()
  const navigate = useNavigate()
  const { data: entries = [], isLoading } = useFetchAllExperimentsQuery()
  const [gifLoaded, setGifLoaded] = useState(false)

  const heroEntry = entries.find(
    (e) =>
      e.simulationName.toLowerCase().includes('bob ross') ||
      e.simulationName.toLowerCase().includes('blob ross')
  ) ?? entries[0]

  return (
    <Box
      sx={{
        pt: { xs: 3, md: 4 },
        pb: { xs: 6, md: 8 },
        px: { xs: 3, md: 8 },
        maxWidth: 1200,
        mx: 'auto'
      }}
    >
      <Stack spacing={{ xs: 4, md: 5 }} sx={{ alignItems: 'center' }}>
        <Box sx={{ maxWidth: 560, width: '100%' }}>
          {isLoading || (heroEntry?.gif != null && !gifLoaded) ? (
            <Skeleton
              variant="rounded"
              sx={{
                width: '100%',
                height: 0,
                paddingBottom: '100%',
                borderRadius: 1
              }}
            />
          ) : null}
          {heroEntry?.gif != null && (
            <Card
              elevation={0}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                display: gifLoaded ? 'block' : 'none'
              }}
            >
              <CardMedia
                component="img"
                image={heroEntry.gif}
                alt={`${heroEntry.simulationName} timelapse`}
                onLoad={(): void => { setGifLoaded(true) }}
                sx={{
                  width: '100%',
                  display: 'block'
                }}
              />
            </Card>
          )}
        </Box>

        <Stack spacing={3} sx={{ textAlign: 'center', maxWidth: 600, alignItems: 'center' }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 400,
              fontStyle: 'italic',
              color: theme.palette.text.secondary,
              lineHeight: 1.4,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            &ldquo;There are no mutations, just happy little accidents&rdquo;
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: theme.palette.text.secondary,
              lineHeight: 1.7,
              maxWidth: 520
            }}
          >
            Evolve populations of semi-transparent polygons through selection,
            crossover, and mutation until they approximate any target image.
            A hands-on exploration of evolutionary computation.
          </Typography>
          <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => { navigate(NavPaths.gallery) }}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              View Gallery
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => { navigate(NavPaths.experiment) }}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2
              }}
            >
              Start Painting
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default HeroSection
