import { metaStore } from "@dataware-tools/api-meta-store-client";
import { AUTH_CONFIG } from "@dataware-tools/app-common";
import { SWRConfig } from "swr";
import { fetchMetaStore } from "utils";
import { DatabaseConfigType, DatabaseColumnsConfigType } from "utils/utilTypes";

const APP_ROUTE = {
  HOME: "/",
  DATABASE_LIST: "/databases",
  RECORD_LIST: "/databases/:database_id/records",
};

const SwrOptions: Parameters<typeof SWRConfig>[0]["value"] = {
  errorRetryCount: 1,
  fetcher: (url) => fetch(url).then((res) => res.json()),
};

const authConfig = {
  domain: AUTH_CONFIG.domain,
  clientId: AUTH_CONFIG.clientId,
  apiUrl: AUTH_CONFIG.apiUrl,
};

const redirectUri =
  typeof window === "undefined" ? null : `${window.location.origin}/callback`;

const pydtkSystemColumns = [
  "database_id",
  "record_id",
  "path",
  "contents",
  "uuid",
  "created_by",
  "creation_time",
  "updated_by",
  "update_time",
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
  "integer",
  "int",
  "float",
  "double",
  "number",
  "datetime",
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

const createSystemMetadata = (
  type: "add" | "update",
  user: { sub: string }
): Record<string, string> => {
  return type === "add"
    ? {
        created_by: user.sub,
        creation_time: new Date().getTime().toString(),
      }
    : type === "update"
    ? {
        updated_by: user.sub,
        update_time: new Date().getTime().toString(),
      }
    : {};
};

const initializeDatabaseConfig = async (
  getAccessToken: Parameters<typeof fetchMetaStore>[0],
  databaseId: string,
  currentConfig: Record<string, any>
): Promise<{ error?: any }> => {
  if (currentConfig.is_initialized_by_data_browser_v0) {
    return {};
  }
  const [, updateConfigError] = await fetchMetaStore(
    getAccessToken,
    metaStore.ConfigService.updateConfig,
    {
      databaseId,
      requestBody: {
        ...currentConfig,
        columns: [
          {
            name: "record_name",
            display_name: "Record name",
            dtype: "string",
            aggregation: "first",
            is_display_field: true,
            is_search_target: true,
            is_record_title: true,
            order_of_input: 0,
            necessity: "required",
          },
          {
            name: "created_by",
            display_name: "Created by",
            dtype: "string",
            aggregation: "addToSet",
          },
          {
            name: "creation_time",
            display_name: "Creation time",
            dtype: "float",
            aggregation: "min",
          },
          {
            name: "updated_by",
            display_name: "Updated by",
            dtype: "string",
            aggregation: "addToSet",
          },
          {
            name: "update_time",
            display_name: "Update time",
            dtype: "float",
            aggregation: "last",
          },
          ...currentConfig.columns,
        ],
        is_initialized_by_data_browser_v0: true,
      },
    }
  );
  return { error: updateConfigError };
};

const leftFillNum = (num: number, targetLength: number): string => {
  return num.toString().padStart(targetLength, "0");
};

const floatToTimecodeString = (time: number | undefined): string => {
  if (time === undefined) {
    return "??:??:??";
  }

  const hour = Math.floor(time / 3600);
  const minute = Math.floor(time / 60);
  const second = Math.floor(time % 60);
  return (
    leftFillNum(hour, 2) +
    ":" +
    leftFillNum(minute, 2) +
    ":" +
    leftFillNum(second, 2)
  );
};

const getFileName = (filePath: string): string =>
  filePath.split("/").slice(-1)[0];

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
  createSystemMetadata,
  initializeDatabaseConfig,
  leftFillNum,
  floatToTimecodeString,
  getFileName,
};
export * from "./fetchClients";
export * from "./toasts";
export * from "./utilTypes";
