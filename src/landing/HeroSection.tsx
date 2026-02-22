import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import {
  Box,
  Button,
  Card,
  CardMedia,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { NavPaths } from '../navigation/config'
import { useFetchAllExperimentsQuery } from '../navigation/navigationSlice'

function HeroSection(): JSX.Element {
  const theme = useTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { data: entries = [], isLoading } = useFetchAllExperimentsQuery()

  const heroEntry = entries.find(
    (e) =>
      e.simulationName.toLowerCase().includes('bob ross') ||
      e.simulationName.toLowerCase().includes('blob ross')
  ) ?? entries[0]

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 8 },
        maxWidth: 1200,
        mx: 'auto'
      }}
    >
      <Stack spacing={{ xs: 4, md: 5 }} sx={{ alignItems: 'center' }}>
        <Box sx={{ maxWidth: 560, width: '100%' }}>
          {isLoading ? (
            <Skeleton
              variant="rounded"
              sx={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: 1
              }}
            />
          ) : heroEntry?.gif != null ? (
            <Card
              elevation={0}
              sx={{
                borderRadius: 1,
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`
              }}
            >
              <CardMedia
                component="img"
                image={heroEntry.gif}
                alt={`${heroEntry.simulationName} timelapse`}
                sx={{
                  width: '100%',
                  display: 'block'
                }}
              />
            </Card>
          ) : null}
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
              startIcon={<AutoAwesomeIcon />}
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

      {!isMobile && (
        <Stack
          direction="row"
          spacing={4}
          sx={{
            mt: 10,
            justifyContent: 'center'
          }}
        >
          {[
            {
              step: '1',
              title: 'Pick an Image',
              description: 'Choose any target image you want to recreate'
            },
            {
              step: '2',
              title: 'Evolve Polygons',
              description:
                'Populations of polygons compete, mutate, and recombine'
            },
            {
              step: '3',
              title: 'Watch it Paint',
              description:
                'See your image emerge from random shapes over generations'
            }
          ].map(({ step, title, description }) => (
            <Stack
              key={step}
              spacing={1}
              sx={{ textAlign: 'center', flex: 1, maxWidth: 280 }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: theme.palette.primary.main,
                  fontSize: '1.5rem'
                }}
              >
                {step}
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, fontSize: '1rem' }}
              >
                {title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary }}
              >
                {description}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default HeroSection
