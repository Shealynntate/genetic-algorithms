import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      dark: '#294954',
      main: '#3b6978', // forest green
      light: '#628793',
    },
    secondary: {
      dark: '#b09e60',
      main: '#FCE38A', // pale yellow
      light: '#fce8a1',
    },
    background: {
      // default: '#F6F8FA',
      // paper: '#FFFFFF',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: '1rem',
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
          // color: '#628793',
          '.MuiSvgIcon-root': {
            fontSize: '1.2rem',
            // fontSize: 'small',
            // fontWeight
          },
        },
      }],
    },
  },
});
// #F38181 dusty rose
export default theme;
