type AwaitType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: Array<any>) => Promise<infer V>
  ? V
  : T;

type DatabaseColumnsConfigType = {
  name: string;
  display_name: string;
  is_secret?: boolean;
  dtype:
    | "string[]"
    | "string"
    | "int"
    | "float"
    | "double"
    | "boolean"
    | "bool"
    | "object";
  aggregation:
    | "accumulator"
    | "addToSet"
    | "avg"
    | "first"
    | "last"
    | "max"
    | "mergeObjects"
    | "min"
    | "push"
    | "stdDevPop"
    | "stdDevSamp"
    | "sum";
}[];
type DatabaseIndexColumnsConfigType = string[];

type DataBrowserInputConfigType = {
  name: string;
  necessity: "required" | "recommended" | "optional";
}[];
type DataBrowserDisplayConfigType = string[];
type DataBrowserSearchConfigType = string[];

type DatabaseConfigType = {
  columns: DatabaseColumnsConfigType;
  index_columns: DatabaseIndexColumnsConfigType;
  data_browser_config?: {
    record_input_config?: DataBrowserInputConfigType;
    record_display_config?: DataBrowserDisplayConfigType;
    record_search_config?: DataBrowserSearchConfigType;
  };
};

type UserActionType =
  | "databases"
  | "databases:read"
  | "databases:write"
  | "databases:write:add"
  | "databases:write:update"
  | "databases:write:delete"
  | "metadata"
  | "metadata:read"
  | "metadata:read:public"
  | "metadata:write"
  | "metadata:write:add"
  | "metadata:write:update"
  | "metadata:write:delete";

export type {
  AwaitType,
  DatabaseConfigType,
  DatabaseColumnsConfigType,
  DatabaseIndexColumnsConfigType,
  DataBrowserInputConfigType,
  DataBrowserDisplayConfigType,
  DataBrowserSearchConfigType,
  UserActionType,
};
