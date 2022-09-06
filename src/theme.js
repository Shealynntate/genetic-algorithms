import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
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
      default: '#F6F8FA',
      paper: '#FFFFFF',
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
  },
});
// #F38181 dusty rose
export default theme;
