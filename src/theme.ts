import { createTheme } from '@mui/material'
import { cyan, purple } from '@mui/material/colors'

// Augment the Theme interface for custom fields
declare module '@mui/material/Fab' {
  interface FabPropsSizeOverrides {
    extrasmall: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    lightCaption: true
    codeCaption: true
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: cyan[500]
    },
    secondary: {
      main: purple[500]
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif'
        }
      }
    },
    MuiFab: {
      variants: [{
        props: { size: 'extrasmall' },
        style: {
          height: 24,
          width: 24,
          minHeight: 0,
          '.MuiSvgIcon-root': {
            fontSize: '1.2rem'
          }
        }
      }]
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif'
        }
      },
      variants: [{
        props: { variant: 'lightCaption' },
        style: {
          fontSize: '0.7rem',
          color: 'GrayText'
        }
      },
      {
        props: { variant: 'codeCaption' },
        style: {
          fontWeight: 400,
          fontSize: '0.75rem',
          lineHeight: 1.66,
          letterSpacing: '0.03333em',
          fontFamily: '"Oxygen Mono", monospace'
        }
      }]
    }
  }
})

export default theme
