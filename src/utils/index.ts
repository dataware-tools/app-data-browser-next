import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { useRef, useEffect } from "react";
import { DatabaseColumnsConfigType } from "utils";

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

const pydtkSystemColumns = ["record_id", "path", "contents"];

const inputFieldsNecessityOrder = [
  "required",
  "recommended",
  "optional",
  "unnecessary",
  undefined,
];

const compStr = (a: string, b: string): number => {
  if (a < b) {
    return -1;
  } else if (a === b) {
    return 0;
  } else {
    return 1;
  }
};

const compInputFields = (
  a: Pick<DatabaseColumnsConfigType[number], "necessity" | "name">,
  b: Pick<DatabaseColumnsConfigType[number], "necessity" | "name">
): number => {
  const diffNecessity =
    inputFieldsNecessityOrder.indexOf(a.necessity) -
    inputFieldsNecessityOrder.indexOf(b.necessity);
  if (diffNecessity !== 0) {
    return diffNecessity;
  } else {
    return compStr(a.name, b.name);
  }
};

export {
  APP_ROUTE,
  SwrOptions,
  authConfig,
  redirectUri,
  usePrevious,
  sleep,
  pydtkSystemColumns,
  compStr,
  compInputFields,
};
export * from "./fetchClients";
export * from "./utilTypes";
