import { atom, useRecoilValue } from "recoil";
import { UserActionType } from "utils";

export const userActionsState = atom<UserActionType[]>({
  key: "userActionsState",
  default: [],
});

export const useIsActionPermitted = (action: UserActionType): boolean => {
  const permittedActions = useRecoilValue(userActionsState);
  return permittedActions.some((permitted) => action.startsWith(permitted));
};
