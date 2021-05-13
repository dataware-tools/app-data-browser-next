import { ToolBar } from "@dataware-tools/app-common";
import CloseIcon from "@material-ui/icons/Close";

type ComponentProps = { onClick: () => void };
const Component = ({ onClick }: ComponentProps): JSX.Element => (
  <ToolBar>
    <CloseIcon
      style={{ cursor: "pointer" }}
      onClick={() => {
        onClick();
      }}
      fontSize="large"
    />
  </ToolBar>
);

export { Component as DialogCloseButton };
export type { ComponentProps as DialogCloseButtonProps };
