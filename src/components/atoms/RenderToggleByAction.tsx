import { ReactNode } from "react";
import { useIsActionPermitted } from "globalStates";
import { UserActionType } from "utils";

export type RenderToggleByActionProps = {
  required: UserActionType;
  children: ReactNode;
};

export const RenderToggleByAction = ({
  required,
  children,
}: RenderToggleByActionProps): JSX.Element | null => {
  const isPermitted = useIsActionPermitted(required || "__noAction");
  return isPermitted ? <>{children}</> : null;
};
