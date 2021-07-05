import { ReactNode } from "react";
import { UserActionType } from "utils";
import { useIsActionPermitted } from "globalStates";

type ContainerProps = {
  required: UserActionType;
  children: ReactNode;
};

const Container = ({
  required,
  children,
}: ContainerProps): JSX.Element | null => {
  const isPermitted = useIsActionPermitted(required);
  return isPermitted ? <>{children}</> : null;
};

export { Container as RenderToggleByAction };
export type { ContainerProps as RenderToggleByActionProps };
