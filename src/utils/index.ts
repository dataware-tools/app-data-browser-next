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
  pydtkSystemColumns,
  compStr,
  compInputFields,
  editableColumnDtype,
  isEditableColumnName,
};
export * from "./fetchClients";
export * from "./utilTypes";
