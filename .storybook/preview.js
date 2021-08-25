import { authConfig, onRedirectCallback, redirectUri } from "../src/utils";

import { Auth0Provider } from "@auth0/auth0-react";
import CssBaseline from "@material-ui/core/CssBaseline";
import React from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { StylesProvider } from "@material-ui/styles";
import { theme } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { SwrOptions } from "../src/utils";
import { userActionsState } from "../src/globalStates";
import { RecoilRoot } from "recoil";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story, context) => {
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
                <RecoilRoot
                  initializeState={({ set }) =>
                    set(userActionsState, ["databases", "metadata"])
                  }
                >
                  <Story {...context} />
                </RecoilRoot>
              </Auth0Provider>
            </SWRConfig>
          </ThemeProvider>
        </StylesProvider>
      </>
    );
  },
];
