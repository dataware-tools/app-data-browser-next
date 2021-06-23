type AwaitType<T> = T extends Promise<infer U>
  ? U
  : T extends (...args: Array<any>) => Promise<infer V>
  ? V
  : T;

type DatabaseColumnsConfigDtypeType =
  | "string[]"
  | "string"
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
  is_display_field?: boolean;
  is_search_target?: boolean;
  is_record_title?: boolean;
}[];
type DatabaseConfigType = {
  columns: DatabaseColumnsConfigType;
  index_columns: string[];
};

export type {
  AwaitType,
  DatabaseConfigType,
  DatabaseColumnsConfigType,
  DatabaseColumnsConfigDtypeType,
  DatabaseColumnsConfigAggregationType,
  DatabaseColumnsConfigNecessityType,
};
