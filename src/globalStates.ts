import { atom } from "recoil";
import { UserActionType } from "utils";

export const userActionsState = atom<UserActionType[]>({
  key: "userActionsState",
  default: [],
});
