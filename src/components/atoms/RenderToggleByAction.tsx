import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { userActionsState } from "globalStates";
import { UserActionType } from "utils";

type ContainerProps = {
  required: UserActionType;
  children: ReactNode;
};

const actionDivider = ":";
const Container = ({
  required,
  children,
}: ContainerProps): JSX.Element | null => {
  const userActions = useRecoilValue(userActionsState);
  if (userActions.length === 0) {
    return null;
  }

  const divided = required.split(actionDivider);
  const permittedActions: UserActionType[] = [];
  for (let i = 1; i++; i <= divided.length) {
    permittedActions.push(
      divided.slice(0, i).join(actionDivider) as UserActionType
    );
  }

  const isPermitted = permittedActions.some((action) =>
    userActions.includes(action)
  );

  return isPermitted ? <>{children}</> : null;
};

export { Container as RenderToggleByAction };
export type { ContainerProps as RenderToggleByActionProps };
