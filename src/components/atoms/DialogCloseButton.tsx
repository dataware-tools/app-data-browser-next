import { ToolBar } from "@dataware-tools/app-common";
import CloseIcon from "@material-ui/icons/Close";
import { SquareIconButton } from "components/atoms/SquareIconButton";

type ComponentProps = { onClick: () => void };
const Component = ({ onClick }: ComponentProps): JSX.Element => (
  <ToolBar
    right={
      <SquareIconButton
        onClick={onClick}
        icon={<CloseIcon fontSize="large" />}
      />
    }
  />
);

export { Component as DialogCloseButton };
export type { ComponentProps as DialogCloseButtonProps };
