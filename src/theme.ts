import { createTheme } from '@mui/material'

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
      main: '#2E7D6F'
    },
    secondary: {
      main: '#D4816B'
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#1A1A2E',
      secondary: '#6B7280'
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #E5E7EB'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", Helvetica, Arial, sans-serif',
          borderRadius: 8,
          textTransform: 'none'
        }
      }
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", Helvetica, Arial, sans-serif'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)'
        }
      }
    },
    MuiFab: {
      variants: [
        {
          props: { size: 'extrasmall' },
          style: {
            height: 24,
            width: 24,
            minHeight: 0,
            '.MuiSvgIcon-root': {
              fontSize: '1.2rem'
            }
          }
        }
      ]
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
          borderRadius: 12
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", Helvetica, Arial, sans-serif'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Inter", Helvetica, Arial, sans-serif'
        }
      },
      variants: [
        {
          props: { variant: 'lightCaption' },
          style: {
            fontSize: '0.7rem',
            color: '#6B7280'
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
        }
      ]
    }
  }
})

export default theme
