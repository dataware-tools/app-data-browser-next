import { SquareIconButton } from "@dataware-tools/app-common";
import { MoreHoriz as MoreIcon } from "@material-ui/icons";
import { MouseEvent, useState } from "react";
import {
  DatabaseMenu,
  DatabaseMenuProps,
} from "components/molecules/DatabaseMenu";

type Props = {
  onOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
  onClose: DatabaseMenuProps["onClose"];
  open: DatabaseMenuProps["open"];
  anchorEl: DatabaseMenuProps["anchorEl"];
} & ContainerProps;

type ContainerProps = {
  onMenuSelect: (targetValue: string) => void;
  menu: DatabaseMenuProps["menu"];
};

const Component = ({
  onOpen,
  onMenuSelect,
  ...delegated
}: Props): JSX.Element | null => {
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

const Container = ({ ...delegated }: ContainerProps): JSX.Element => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLDivElement>(null);
  const isMenuOpen = Boolean(menuAnchorEl);
  const onMenuOpen: Props["onOpen"] = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const onMenuClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <Component
      onOpen={onMenuOpen}
      open={isMenuOpen}
      onClose={onMenuClose}
      anchorEl={menuAnchorEl}
      {...delegated}
    />
  );
};

export { Container as DatabaseMenuButton };
export type { ContainerProps as DatabaseMenuButtonProps };
