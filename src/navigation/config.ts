import { type Page } from './types'

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
