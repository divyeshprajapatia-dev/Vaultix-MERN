import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Deep blue
    },
    secondary: {
      main: '#00bcd4', // Teal
    },
    background: {
      default: '#f4f6fb',
      paper: '#fff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Roboto, Inter, Arial, sans-serif',
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
});

export default theme;