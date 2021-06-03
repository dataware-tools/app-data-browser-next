import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { useRef, useEffect } from "react";

const APP_ROUTE = {
  HOME: "/",
  DATABASE_LIST: "/databases",
  RECORD_LIST: "/databases/:database_id/records",
};

const SwrOptions = {
  errorRetryCount: 1,
};

const authConfig = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || AUTH_CONFIG.domain,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || AUTH_CONFIG.clientId,
  apiUrl: process.env.REACT_APP_AUTH0_API_URL || AUTH_CONFIG.apiUrl,
};

const redirectUri =
  typeof window === "undefined" ? null : window.location.origin;

// See: https://ja.reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export { APP_ROUTE, SwrOptions, authConfig, redirectUri, usePrevious, sleep };
export * from "./fetchClients";
export * from "./utilTypes";
