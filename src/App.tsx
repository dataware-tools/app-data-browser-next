import "./scrollbar.global.css";
import { theme } from "@dataware-tools/app-common";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import { RecoilRoot } from "recoil";
import { SWRConfig } from "swr";
import Router from "./Router";
import { SwrOptions } from "./utils/index";

const App = () => {
  return (
    <SWRConfig value={SwrOptions}>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RecoilRoot>
            <Router />
          </RecoilRoot>
        </ThemeProvider>
      </StylesProvider>
    </SWRConfig>
  );
};

export default App;
