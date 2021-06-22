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
type RecordAddInputableColumnsConfig = {
  name: string;
  necessity: "required" | "recommended" | "optional";
}[];
type RecordDetailTitleColumnConfig = string;
type RecordListDisplayColumns = string[];
type RecordSearchTargetColumns = string[];

type DataBrowserConfigType = {
  record_add_inputable_columns?: RecordAddInputableColumnsConfig;
  record_detail_title_column?: RecordDetailTitleColumnConfig;
  record_list_display_columns?: RecordListDisplayColumns;
  record_search_target_columns?: RecordSearchTargetColumns;
};
type DatabaseConfigType = {
  columns: DatabaseColumnsConfigType;
  index_columns: string[];
  data_browser_config?: DataBrowserConfigType;
};

export type {
  AwaitType,
  DatabaseConfigType,
  DataBrowserConfigType,
  RecordAddInputableColumnsConfig,
  RecordDetailTitleColumnConfig,
  RecordListDisplayColumns,
  RecordSearchTargetColumns,
};
