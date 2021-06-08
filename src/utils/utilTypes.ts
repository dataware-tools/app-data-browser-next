type AwaitType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: Array<any>) => Promise<infer V>
  ? V
  : T;

type DatabaseColumnsConfigType = {
  name: string;
  display_name: string;
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

export type {
  AwaitType,
  DatabaseConfigType,
  DatabaseColumnsConfigType,
  DatabaseIndexColumnsConfigType,
  DataBrowserInputConfigType,
  DataBrowserDisplayConfigType,
  DataBrowserSearchConfigType,
};
