import { AppProps } from "next/app";
import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import { theme, PageWrapper } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { SwrOptions, authConfig, redirectUri } from "utils/index";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { repository } from "../../package.json";
import "./scrollbar.global.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const onRedirectCallback = (appState: AppState): void => {
    const nonQueryParamURL =
      appState && appState.returnTo
        ? appState.returnTo
        : typeof window === "undefined"
        ? null
        : window.location.origin;
    history.replaceState(null, "", nonQueryParamURL);
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
                <PageWrapper repository={repository}>
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
