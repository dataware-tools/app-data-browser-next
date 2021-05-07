import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const HDLBaseColor = 200;
const BasicSaturation = "10%";
// Create a theme instance.
let theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Oxanium",
      "Helvetica Neue",
      "Arial",
      "Helvetica",
      "Roboto",
      "Noto Sans JP",
      "sans-serif",
    ].join(","),
  },
  palette: {
    common: {
      black: `hsl(${HDLBaseColor}, ${BasicSaturation}, 2%)`,
      white: `hsl(${HDLBaseColor}, ${BasicSaturation}, 98%)`,
    },
    primary: {
      light: `hsl(${HDLBaseColor}, 100%, 75%)`,
      main: `hsl(${HDLBaseColor}, 92%, 40%)`,
      dark: `hsl(${HDLBaseColor}, 100%, 25%)`,
    },
    secondary: {
      light: `hsl(266, 28%, 70%)`,
      main: `hsl(266, 36%, 52%)`,
      dark: `hsl(280, 50%, 33%)`,
    },
    error: {
      light: `hsl(0, 85%, 73%)`,
      main: `hsl(350, 75%, 50%)`,
      dark: `hsl(1, 77%, 34%)`,
    },
    warning: {
      light: `hsl(60, 80%, 75%)`,
      main: `hsl(63, 100%, 45%)`,
      dark: `hsl(60, 75%, 30%)`,
    },
    success: {
      light: `hsl(140, 55%, 71%)`,
      main: `hsl(140, 60%, 42%)`,
      dark: `hsl(140, 58%, 22%)`,
    },
    info: {
      light: `hsl(${HDLBaseColor}, 100%, 75%)`,
      main: `hsl(${HDLBaseColor}, 92%, 40%)`,
      dark: `hsl(${HDLBaseColor}, 100%, 25%)`,
    },
    background: {
      default: `hsl(${HDLBaseColor}, ${BasicSaturation}, 98%)`,
      paper: `hsl(${HDLBaseColor}, ${BasicSaturation}, 100%)`,
    },
    text: {
      primary: `hsl(${HDLBaseColor}, ${BasicSaturation}, 13%)`,
      secondary: `hsl(${HDLBaseColor}, ${BasicSaturation}, 46%)`,
      disabled: `hsl(${HDLBaseColor}, ${BasicSaturation}, 62%)`,
    },
    divider: `hsl(${HDLBaseColor}, ${BasicSaturation}, 88%)`,
    // Not working!
    // props: {
    //   MuiButton: {
    //     disableElevation: true,
    //     variant: "contained",
    //     color: "primary",
    //   },
    // },
  },
});

theme = responsiveFontSizes(theme);
export default theme;
