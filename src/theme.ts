import { createTheme } from '@mui/material'
import { amber, cyan } from '@mui/material/colors'

// Augment the Theme interface for custom fields
declare module '@mui/material/Fab' {
  interface FabPropsSizeOverrides {
    extrasmall: true
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: cyan[500]
    },
    secondary: {
      main: amber[500]
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
      }
    }
  }
})

export default theme