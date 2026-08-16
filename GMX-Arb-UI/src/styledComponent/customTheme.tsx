// src/theme.ts
import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    url: {
      main: string;
      hover: string;
    };
    chart: {
      bg: string;
      line: string;
      text: string;
      areaTop: string;
      areaBottom: string;
    };
  }
  interface PaletteOptions {
    url?: {
      main?: string;
      hover?: string;
    };
    chart?: {
      bg?: string;
      line?: string;
      text?: string;
      areaTop?: string;
      areaBottom?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0E1A37', // Dark blue background
      paper: '#1C274C',   // Slightly lighter blue for paper elements
    },
    primary: {
      main: '#3399FF',    // Bright blue for primary elements
    },
    secondary: {
      main: '#19857b',    // Teal for secondary elements
    },
    text: {
      primary: '#FFFFFF', // White for primary text
      secondary: '#B2BAC2', // Light grey for secondary text
    },
    success: {
      main: '#00FF00',    // Green for success elements
      light: '#0B6623',   // Light green for success elements
    },
    url: {
      main: '#4DA3FF', // Light blue color for URLs
      hover: '#66B2FF', // Slightly lighter blue for hover state
    },
    chart: {
      bg: '#0E1A37',
      line: '#3399FF',
      text: '#FFFFFF',
      areaTop: '#3399FF',
      areaBottom: 'rgba(51, 153, 255, 0.28)',
    }
  },
  typography: {
    fontFamily: "'Roboto', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: '5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '3rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.6,
      // marginBottom: '0.75rem',
    },
    body2: {
      fontWeight: 400,
      fontSize: '0.875rem',
    },
  },
});

export default theme;

