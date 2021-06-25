import { ReactNode } from "react";
import { useRecoilValue } from "recoil";
import { userActionsState } from "globalStates";
import { UserActionType } from "utils";

type ContainerProps = {
  required: UserActionType;
  children: ReactNode;
};

const Container = ({
  required,
  children,
}: ContainerProps): JSX.Element | null => {
  const userActions = useRecoilValue(userActionsState);
  if (userActions.length === 0) {
    return null;
  }

  const isPermitted = userActions.some((action) => required.startsWith(action));

  return isPermitted ? <>{children}</> : null;
};

export { Container as RenderToggleByAction };
export type { ContainerProps as RenderToggleByActionProps };
