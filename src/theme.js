import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      dark: '#168676',
      main: '#20c0a9', // mint green
      light: '#4cccba',
    },
    secondary: {
      dark: '#745379',
      main: '#89608E',
      light: '#966D9C',
    },
    info: {
      dark: '#7896A5',
      main: '#ACD7EC', // Light Steel Blue
      light: '#BCDFEF',
    },
    error: {
      dark: '#893830',
      main: '#c45145', // faded brick red
      light: '#cf736a',
    },
    background: {
      mask: [
        '#312f35',
      ],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
        },
      },
    },
    MuiFab: {
      variants: [{
        props: { size: 'extrasmall' },
        style: {
          height: 24,
          width: 24,
          minHeight: 0,
          '.MuiSvgIcon-root': {
            fontSize: '1.2rem',
          },
        },
      }],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Montserrat", Helvetica, Arial, sans-serif',
        },
      },
    },
  },
});
// #F38181 dusty rose
export default theme;
