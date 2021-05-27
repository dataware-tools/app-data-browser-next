import { AppState } from "@auth0/auth0-react";
import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { useRef, useEffect } from "react";

export const APP_ROUTE = {
  HOME: "/",
  DATABASE_LIST: "/databases",
  RECORD_LIST: "/databases/:database_id/records",
};

export const SwrOptions = {
  errorRetryCount: 1,
};

export const authConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || AUTH_CONFIG.domain,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || AUTH_CONFIG.clientId,
  apiUrl: process.env.REACT_APP_AUTH0_API_URL || AUTH_CONFIG.apiUrl,
};
export const redirectUri =
  typeof window === "undefined" ? null : window.location.origin;

export const onRedirectCallback = (appState: AppState): void => {
  const nonQueryParamURL =
    appState && appState.returnTo
      ? appState.returnTo
      : typeof window === "undefined"
      ? null
      : window.location.origin;
  history.replaceState(null, "", nonQueryParamURL);
};

// See: https://ja.reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
