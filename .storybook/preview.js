import {
  authConfig,
  onRedirectCallback,
  redirectUri,
} from "../src/pages/_app_csr";

import { Auth0Provider } from "@auth0/auth0-react";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import theme from "../src/theme";
import { SWRConfig } from "swr";
import { SwrOptions } from "../src/utils";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (story) => {
    return (
      <>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oxanium:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <StylesProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SWRConfig value={SwrOptions}>
              <Auth0Provider
                domain={authConfig.domain}
                clientId={authConfig.clientId}
                audience={authConfig.apiUrl}
                redirectUri={redirectUri}
                onRedirectCallback={onRedirectCallback}
              >
                {story()}
              </Auth0Provider>
            </SWRConfig>
          </ThemeProvider>
        </StylesProvider>
      </>
    );
  },
];
