import { SquareIconButton } from "@dataware-tools/app-common";
import { MoreHoriz as MoreIcon } from "@mui/icons-material";
import { MouseEvent, useState } from "react";
import {
  DatabaseMenu,
  DatabaseMenuProps,
} from "components/molecules/DatabaseMenu";

export type DatabaseMenuButtonPresentationProps = {
  onOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
  onClose: DatabaseMenuProps["onClose"];
  open: DatabaseMenuProps["open"];
  anchorEl: DatabaseMenuProps["anchorEl"];
} & DatabaseMenuButtonProps;

export type DatabaseMenuButtonProps = {
  onMenuSelect: (targetValue: string) => void;
  menu: DatabaseMenuProps["menu"];
};

export const DatabaseMenuButtonPresentation = ({
  onOpen,
  onMenuSelect,
  ...delegated
}: DatabaseMenuButtonPresentationProps): JSX.Element | null => {
  return (
    <div>
      <SquareIconButton icon={<MoreIcon />} onClick={onOpen} />
      <DatabaseMenu
        {...delegated}
        onClick={onMenuSelect as (value: string) => void}
      />
    </div>
  );
};

export const DatabaseMenuButton = ({
  ...delegated
}: DatabaseMenuButtonProps): JSX.Element => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: DatabaseMenuButtonPresentationProps["onOpen"] = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <DatabaseMenuButtonPresentation
      onOpen={onMenuOpen}
      open={isMenuOpen}
      onClose={onMenuClose}
      anchorEl={menuAnchorEl}
      {...delegated}
    />
  );
};
