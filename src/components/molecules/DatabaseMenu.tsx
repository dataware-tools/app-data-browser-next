import Box, { BoxProps } from "@material-ui/core/Box";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export type DatabaseMenuProps = {
  menu: (
    | { label?: string; value: string; boxProps?: Omit<BoxProps, "children"> }
    | undefined
  )[];
  onClick: (targetValue: string) => void;
  onClose: () => void;
  open: boolean;
  anchorEl: HTMLElement | null;
};

export const DatabaseMenu = ({
  menu,
  onClick,
  onClose,
  open,
  anchorEl,
}: DatabaseMenuProps): JSX.Element => {
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
      {menu.map((item, i) =>
        item ? (
          <MenuItem
            key={i}
            onClick={() => {
              onClick(item.value);
              onClose();
            }}
          >
            <Box {...item.boxProps}>{item.label || item.value}</Box>
          </MenuItem>
        ) : null
      )}
    </Menu>
  );
};
