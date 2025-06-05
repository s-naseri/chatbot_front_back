// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'IRANYekanX', 'Yekan', 'Vazir', sans-serif",
  },
  direction: "rtl",
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'IRANYekanX';
          font-style: normal;
          font-weight: 400;
          font-display: swap;
          src: url('/fonts/IRANYekanX-Regular.woff2') format('woff2'),
               url('/fonts/IRANYekanX-Regular.woff') format('woff');
        }
        @font-face {
          font-family: 'IRANYekanX';
          font-style: normal;
          font-weight: 700;
          font-display: swap;
          src: url('/fonts/IRANYekanX-Bold.woff2') format('woff2'),
               url('/fonts/IRANYekanX-Bold.woff') format('woff');
        }
        body {
          font-family: 'IRANYekanX', sans-serif !important;
          direction: rtl;
        }
      `,
    },
  },
});

export default theme;
