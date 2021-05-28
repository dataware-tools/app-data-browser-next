import Menu from "@material-ui/core/Menu";
import { MenuItem } from "@material-ui/core";
import { DatabaseConfigNameType } from "components/organisms/DatabaseConfigModal";

type ComponentProps = {
  menu: { label: string; value: DatabaseConfigNameType }[];
  onClick: (targetValue: DatabaseConfigNameType) => void;
  onClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
};

const Component = ({
  menu,
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
      {menu.map((item, i) => (
        <MenuItem
          key={i}
          onClick={() => {
            onClick(item.value);
            onClose();
          }}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export { Component as DatabaseConfigMenu };
export type { ComponentProps as DatabaseConfigMenuProps };
