import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { PageWrapper } from "../components/organisms/PageWrapper";

import { AUTH_CONFIG } from "@dataware-tools/app-common";

type SafeHydrateProps = {
  children: JSX.Element | JSX.Element[];
};

export const authConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || AUTH_CONFIG.domain,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || AUTH_CONFIG.clientId,
  apiUrl: process.env.REACT_APP_AUTH0_API_URL || AUTH_CONFIG.apiUrl,
};
export const redirectUri = window.location.origin;

export const onRedirectCallback = (appState: AppState): void => {
  const nonQueryParamURL =
    appState && appState.returnTo ? appState.returnTo : window.location.origin;
  history.replaceState(null, "", nonQueryParamURL);
};

const SafeHydrate = (props: SafeHydrateProps): JSX.Element => {
  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      audience={authConfig.apiUrl}
      redirectUri={redirectUri}
      onRedirectCallback={onRedirectCallback}
    >
      <PageWrapper>{props.children}</PageWrapper>
    </Auth0Provider>
  );
};

export default SafeHydrate;
