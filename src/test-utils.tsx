import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { theme, AUTH_CONFIG } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { AppState, Auth0Provider } from "@auth0/auth0-react";

export const authConfig = {
  domain: process.env.JEST_AUTH0_DOMAIN || AUTH_CONFIG.domain,
  clientId: process.env.JEST_AUTH0_CLIENT_ID || AUTH_CONFIG.clientId,
  apiUrl: process.env.JEST_AUTH0_API_URL || AUTH_CONFIG.apiUrl,
};
export const redirectUri = window.location.origin;

export const onRedirectCallback = (appState: AppState): void => {
  const nonQueryParamURL =
    appState && appState.returnTo ? appState.returnTo : window.location.origin;
  history.replaceState(null, "", nonQueryParamURL);
};

const TestAuthProvider: React.FC = ({ children }) => {
  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      audience={authConfig.apiUrl}
      redirectUri={redirectUri}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};
const AllTheProviders: React.FC = ({ children }) => {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SWRConfig value={{ dedupingInterval: 0 }}>{children}</SWRConfig>
      </ThemeProvider>
    </StylesProvider>
  );
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) => render(ui, { wrapper: AllTheProviders, ...options });

// eslint-disable-next-line import/export
export * from "@testing-library/react";

// eslint-disable-next-line import/export
export { customRender as render, TestAuthProvider };
