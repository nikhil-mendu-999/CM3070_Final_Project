import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A233A", // Deep navy blue
      light: "#394264",
      dark: "#101529",
      contrastText: "#FFD166"
    },
    secondary: {
      main: "#FFD166", // Gold
      contrastText: "#1A233A"
    },
    background: {
      default: "#F5F4EF", // Elegant cream
      paper: "#FFFFFF"
    },
    text: {
      primary: "#1A233A",
      secondary: "#676879"
    },
    error: {
      main: "#C0392B",
      contrastText: "#fff"
    },
    divider: "#E7E7EA"
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: { background: "#1A233A" }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          boxShadow: "0 6px 24px 0 rgba(26,35,58,0.06)"
        }
      }
    },
    MuiButton: {
  styleOverrides: {
    containedPrimary: {
      background: "#FFD166", // Use only gold color, no gradient
      color: "#1A233A",
      '&:hover': {
        background: "#FFCD46", // a slightly darker gold on hover
      },
    },
    contained: {
      fontWeight: 700,
      borderRadius: 10
    }
  }
}

  },
  typography: {
    fontFamily: "Inter, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    h4: {
      fontWeight: 700,
      letterSpacing: 0.1
    }
  }
});

export default theme;
