import Menu from "@material-ui/core/Menu";
import { MenuItem } from "@material-ui/core";
import { RenderToggleByAction } from "components/atoms/RenderToggleByAction";

type ComponentProps = {
  onClick: (
    targetValue:
      | "Configure input columns"
      | "Configure display columns"
      | "Configure search target columns"
      | "Configure secret columns"
      | "Export metadata"
      | "setting"
  ) => void;
  onClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
};

const Component = ({
  onClick,
  onClose,
  open,
  anchorEl,
}: ComponentProps): JSX.Element => {
  return (
    <Menu
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <RenderToggleByAction required="databases:write:update">
        <MenuItem
          onClick={() => {
            onClick("Configure input columns");
            onClose();
          }}
        >
          Configure input columns
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClick("Configure display columns");
            onClose();
          }}
        >
          Configure display columns
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClick("Configure search target columns");
            onClose();
          }}
        >
          Configure search target columns
        </MenuItem>
        <MenuItem
          onClick={() => {
            onClick("Configure secret columns");
            onClose();
          }}
        >
          Configure secret columns
        </MenuItem>
      </RenderToggleByAction>
      <MenuItem
        onClick={() => {
          onClick("Export metadata");
          onClose();
        }}
      >
        Export metadata
      </MenuItem>
      <MenuItem
        onClick={() => {
          onClick("setting");
          onClose();
        }}
      >
        setting
      </MenuItem>
    </Menu>
  );
};

export { Component as DatabaseMenu };
export type { ComponentProps as DatabaseMenuProps };
