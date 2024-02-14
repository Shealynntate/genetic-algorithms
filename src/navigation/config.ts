import theme from '../theme'
import { type AppState, type Page } from './types'

/**
 * The title of the site displayed in the header.
 */
export const SiteTitle = 'Genetic Algorithms'

/**
 * The paths for the navigation buttons in the site header.
 */
export const NavPaths: Record<Page, string> = {
  gallery: '/',
  experiment: '/experiment',
  yourArt: '/your-art',
  admin: '/admin',
  github: 'https://github.com/Shealynntate/genetic-algorithms'
}

/**
 * The labels for the navigation buttons in the site header.
 */
export const NavLabels: Record<Page, string> = {
  gallery: 'Gallery',
  experiment: 'Experiment',
  yourArt: 'Your Art',
  admin: 'Admin Page',
  github: 'GitHub Page'
}

export const MIN_BROWSER_WIDTH = 400

export const MIN_BROWSER_HEIGHT = 400

export const RunningStates: AppState[] = ['running']

export const defaultLineColor = theme.palette.primary.main

export const lineColors = [
  theme.palette.primary.main,
  theme.palette.secondary.main,
  theme.palette.error.main,
  theme.palette.warning.main,
  theme.palette.info.main,
  theme.palette.success.main,

  theme.palette.primary.light,
  theme.palette.secondary.light,
  theme.palette.error.light,
  theme.palette.warning.light,
  theme.palette.info.light,
  theme.palette.success.light,

  theme.palette.primary.dark,
  theme.palette.secondary.dark,
  theme.palette.error.dark,
  theme.palette.warning.dark,
  theme.palette.info.dark,
  theme.palette.success.dark
]
