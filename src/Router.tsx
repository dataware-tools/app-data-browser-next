import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { PageWrapper } from "@dataware-tools/app-common";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import packageInfo from "../package.json";
import { authConfig, redirectUri } from "./utils/index";
import { DatabasesPage } from "pages/DatabasesPage";
import { IndexPage } from "pages/IndexPage";
import { RecordsPage } from "pages/RecordsPage";

const Router = (): JSX.Element | null => {
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
      <BrowserRouter basename={packageInfo.basePath}>
        <Auth0Provider
          domain={authConfig.domain}
          clientId={authConfig.clientId}
          audience={authConfig.apiUrl}
          // @ts-expect-error redirectUri is not undefined in client side.
          redirectUri={redirectUri}
          onRedirectCallback={onRedirectCallback}
        >
          <PageWrapper repository={packageInfo.repository}>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/databases" element={<DatabasesPage />} />
              <Route
                path="/databases/:databaseId/records"
                element={<RecordsPage />}
              />
            </Routes>
          </PageWrapper>
        </Auth0Provider>
      </BrowserRouter>
    </>
  );
};

export default Router;
