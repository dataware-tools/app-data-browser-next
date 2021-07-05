import { atom, useRecoilValue } from "recoil";
import {
  ParamTypeListDatabases,
  ParamTypeListRecords,
  UserActionType,
} from "utils";

export const userActionsState = atom<UserActionType[]>({
  key: "userActionsState",
  default: [],
});

export const useIsActionPermitted = (action: UserActionType): boolean => {
  const permittedActions = useRecoilValue(userActionsState);
  if (!permittedActions) {
    return false;
  }
  return permittedActions.some((permitted) => action.startsWith(permitted));
};

type RecordPaginateState = {
  page: NonNullable<ParamTypeListRecords["page"]>;
  perPage: NonNullable<ParamTypeListRecords["perPage"]>;
  search: NonNullable<ParamTypeListRecords["search"]>;
  searchKey: NonNullable<ParamTypeListRecords["searchKey"]>;
};

export const recordPaginateState = atom<RecordPaginateState>({
  key: "recordPaginateState",
  default: { page: 1, perPage: 20, search: "", searchKey: [] },
});

type DatabasePaginateState = {
  page: NonNullable<ParamTypeListDatabases["page"]>;
  perPage: NonNullable<ParamTypeListDatabases["perPage"]>;
  search: NonNullable<ParamTypeListDatabases["search"]>;
  searchKey: NonNullable<ParamTypeListDatabases["searchKey"]>;
};

export const databasePaginateState = atom<DatabasePaginateState>({
  key: "recordPaginateState",
  default: { page: 1, perPage: 20, search: "", searchKey: [] },
});
