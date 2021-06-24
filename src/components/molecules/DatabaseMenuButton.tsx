import { MouseEvent, useState } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import {
  DatabaseMenu,
  DatabaseMenuProps,
} from "components/molecules/DatabaseMenu";
import { SquareIconButton } from "@dataware-tools/app-common";
import { DatabaseConfigNameType } from "components/organisms/DatabaseConfigModal";

type Props = {
  onOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
  onClose: DatabaseMenuProps["onClose"];
  open: DatabaseMenuProps["open"];
  anchorEl: DatabaseMenuProps["anchorEl"];
} & ContainerProps;

type ContainerProps = {
  onMenuSelect: DatabaseMenuProps["onClick"];
};

const Component = ({
  onOpen,
  onMenuSelect,
  ...delegated
}: Props): JSX.Element | null => {
  return (
    <div>
      <SquareIconButton icon={<MenuIcon />} onClick={onOpen} />
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
export type {
  ContainerProps as DatabaseMenuButtonProps,
  DatabaseConfigNameType,
};
