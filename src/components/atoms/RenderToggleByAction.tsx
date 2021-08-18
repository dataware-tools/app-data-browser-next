import { ReactNode } from "react";
import { useIsActionPermitted } from "globalStates";
import { UserActionType } from "utils";

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
