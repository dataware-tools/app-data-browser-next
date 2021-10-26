import { metaStore } from "@dataware-tools/api-meta-store-client";

type AwaitType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: Array<any>) => Promise<infer V>
  ? V
  : T;

type DatabaseColumnsConfigDtypeType =
  | "string[]"
  | "string"
  | "str"
  | "text"
  | "int"
  | "float"
  | "double"
  | "boolean"
  | "bool"
  | "object";
type DatabaseColumnsConfigAggregationType =
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
type DatabaseColumnsConfigNecessityType =
  | "required"
  | "recommended"
  | "optional"
  | "unnecessary";
type DatabaseColumnsConfigType = {
  name: string;
  display_name: string;
  dtype: DatabaseColumnsConfigDtypeType;
  aggregation: DatabaseColumnsConfigAggregationType;
  necessity?: DatabaseColumnsConfigNecessityType;
  order_of_input?: number;
  is_secret?: boolean;
  is_display_field?: boolean;
  is_search_target?: boolean;
  is_record_title?: boolean;
}[];
type DatabaseConfigType = {
  columns: DatabaseColumnsConfigType;
  index_columns: string[];
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
  | "metadata:write:delete"
  | "file"
  | "file:read"
  | "file:write"
  | "file:write:add"
  | "file:write:delete";

type ParamTypeListRecords = Parameters<
  typeof metaStore.RecordService.listRecords
>["0"];

type ParamTypeListDatabases = Parameters<
  typeof metaStore.DatabaseService.listDatabases
>["0"];

export type {
  ParamTypeListRecords,
  ParamTypeListDatabases,
  AwaitType,
  DatabaseConfigType,
  DatabaseColumnsConfigType,
  UserActionType,
  DatabaseColumnsConfigDtypeType,
  DatabaseColumnsConfigAggregationType,
  DatabaseColumnsConfigNecessityType,
};
