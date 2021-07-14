import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { DatabaseConfigType, DatabaseColumnsConfigType } from "utils/utilTypes";

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

const pydtkSystemColumns = [
  "database_id",
  "record_id",
  "path",
  "contents",
  "uuid",
];

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

const isEditableColumnName = (
  getConfigRes: DatabaseConfigType,
  name: string
): boolean => {
  return (
    !pydtkSystemColumns.includes(name) &&
    !getConfigRes?.index_columns.includes(name) &&
    !name.startsWith("_")
  );
};

const editableColumnDtype: DatabaseColumnsConfigType[number]["dtype"][] = [
  "string",
  "str",
  "text",
  "double",
  "float",
  "int",
];

const compInputFields = (
  a: Pick<
    DatabaseColumnsConfigType[number],
    "order_of_input" | "necessity" | "name"
  >,
  b: Pick<
    DatabaseColumnsConfigType[number],
    "order_of_input" | "necessity" | "name"
  >
): number => {
  if (a.necessity === "unnecessary" || b.necessity === "unnecessary") {
    return 0;
  } else if (a.order_of_input != null && b.order_of_input != null) {
    return a.order_of_input - b.order_of_input;
  } else {
    const diffNecessity =
      inputFieldsNecessityOrder.indexOf(a.necessity) -
      inputFieldsNecessityOrder.indexOf(b.necessity);
    if (diffNecessity !== 0) {
      return diffNecessity;
    } else {
      return compStr(a.name, b.name);
    }
  }
};

const extractReasonFromFetchError = (fetchError: {
  body?: { detail?: unknown };
}): string => {
  if (typeof fetchError.body?.detail === "string") {
    return fetchError.body?.detail;
  } else if (fetchError.body?.detail) {
    return JSON.stringify(fetchError.body.detail);
  } else {
    return JSON.stringify(fetchError);
  }
};

export {
  APP_ROUTE,
  SwrOptions,
  authConfig,
  redirectUri,
  pydtkSystemColumns,
  compStr,
  compInputFields,
  editableColumnDtype,
  isEditableColumnName,
  extractReasonFromFetchError,
};
export * from "./fetchClients";
export * from "./utilTypes";
