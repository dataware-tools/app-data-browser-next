import { AppProps } from "next/app";
import React, { useEffect } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Head from "next/head";
import { ThemeProvider, StylesProvider } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import theme from "../theme";
import { SWRConfig } from "swr";
import { SwrOptions } from "../utils/index";
import "./scrollbar.global.css";

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles?.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const SafeHydrate = dynamic(() => import("./_app_csr"), { ssr: false });
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <title>App template Next - Dataware-tools</title>
      </Head>
      <React.StrictMode>
        <SWRConfig value={SwrOptions}>
          <StylesProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              {/* See: https://ryotarch.com/javascript/react/next-js-with-csr/ */}
              <SafeHydrate>
                <Component {...pageProps} />
              </SafeHydrate>
            </ThemeProvider>
          </StylesProvider>
        </SWRConfig>
      </React.StrictMode>
    </>
  );
};

export default App;
