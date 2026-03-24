import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f5c2e", // --green-600
      light: "#2d7a40", // --green-500
      dark: "#1a4425", // --green-700
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#3d9e55", // --green-400
      light: "#6abf7e", // --green-300
      dark: "#2d7a40", // --green-500
    },
    background: {
      default: "#f0f9f2", // --green-50
      paper: "#ffffff", // --surface
    },
    text: {
      primary: "#0a1f0f", // --text-primary
      secondary: "#4a6e54", // --text-secondary
      disabled: "#7a9e84", // --text-muted
    },
    divider: "#ddeee1", // --border
    success: {
      main: "#2d7a40",
      light: "#6abf7e",
      dark: "#1a4425",
    },
    error: {
      main: "#c0392b",
    },
    warning: {
      main: "#d68910",
    },
    info: {
      main: "#1f5c2e",
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--green-900": "#0a1f0f",
          "--green-800": "#0f2d16",
          "--green-700": "#1a4425",
          "--green-600": "#1f5c2e",
          "--green-500": "#2d7a40",
          "--green-400": "#3d9e55",
          "--green-300": "#6abf7e",
          "--green-100": "#d4edd9",
          "--green-50": "#f0f9f2",
          "--surface": "#ffffff",
          "--surface-2": "#f5faf6",
          "--border": "#ddeee1",
          "--text-primary": "#0a1f0f",
          "--text-secondary": "#4a6e54",
          "--text-muted": "#7a9e84",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          color: "#0a1f0f",
          borderBottom: "1px solid #ddeee1",
          boxShadow: "none",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          borderRight: "1px solid #ddeee1",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          textTransform: "none",
        },
        contained: {
          backgroundColor: "#1f5c2e",
          color: "#ffffff",
          "&:hover": { backgroundColor: "#1a4425" },
        },
        outlined: {
          borderColor: "#1f5c2e",
          color: "#1f5c2e",
          "&:hover": { backgroundColor: "#f0f9f2" },
        },
        text: {
          color: "#0a1f0f",
          "&:hover": { backgroundColor: "#f0f9f2" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          border: "1px solid #ddeee1",
          boxShadow: "0 1px 4px rgba(10,31,15,0.06)",
          borderRadius: 12,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 500 },
        colorPrimary: {
          backgroundColor: "#d4edd9",
          color: "#1f5c2e",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "&.Mui-selected": {
            backgroundColor: "#d4edd9",
            color: "#1f5c2e",
            "& .MuiListItemIcon-root": { color: "#1f5c2e" },
            "&:hover": { backgroundColor: "#d4edd9" },
          },
          "&:hover": { backgroundColor: "#f0f9f2" },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { color: "#4a6e54", minWidth: 40 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          "& .MuiTableCell-root": {
            backgroundColor: "#f5faf6",
            color: "#4a6e54",
            fontWeight: 600,
            borderBottom: "1px solid #ddeee1",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: "1px solid #ddeee1" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { backgroundColor: "#d4edd9", borderRadius: 4 },
        bar: { backgroundColor: "#1f5c2e", borderRadius: 4 },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "#ddeee1" },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#0a1f0f",
          fontSize: "0.75rem",
        },
      },
    },
  },
});

export default theme;
