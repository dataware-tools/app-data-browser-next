import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { theme, PageWrapper } from "@dataware-tools/app-common";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider } from "@mui/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import React, { useEffect } from "react";
import { SWRConfig } from "swr";
import packageInfo from "../../package.json";
import { SwrOptions, authConfig, redirectUri } from "utils/index";
import "./scrollbar.global.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const onRedirectCallback = (appState: AppState): void => {
    if (appState?.returnTo) {
      window.location.href = appState.returnTo;
    } else {
      // Remove the code and state parameters from the url
      history.replaceState(
        null,
        "",
        ` ${window.location.origin}${window.location.pathname} `
      );
    }
  };

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>Data Browser - Dataware-tools</title>
      </Head>
      <React.StrictMode>
        <SWRConfig value={SwrOptions}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Auth0Provider
                domain={authConfig.domain}
                clientId={authConfig.clientId}
                audience={authConfig.apiUrl}
                // @ts-expect-error redirectUri is not undefined in client side.
                redirectUri={redirectUri}
                onRedirectCallback={onRedirectCallback}
              >
                <PageWrapper repository={packageInfo.repository}>
                  <Component {...pageProps} />
                </PageWrapper>
              </Auth0Provider>
            </ThemeProvider>
          </StylesProvider>
        </SWRConfig>
      </React.StrictMode>
    </>
  );
};

export default App;
