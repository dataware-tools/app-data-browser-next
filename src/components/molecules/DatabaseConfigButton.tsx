import { MouseEvent, useState } from "react";
import SettingsIcon from "@material-ui/icons/Settings";
import {
  DatabaseConfigMenu,
  DatabaseConfigMenuProps,
} from "components/molecules/DatabaseConfigMenu";
import { SquareIconButton } from "components/atoms/SquareIconButton";

type Props = {
  onOpen: (event: MouseEvent<HTMLDivElement>) => void | Promise<void>;
  onClose: DatabaseConfigMenuProps["onClose"];
  open: DatabaseConfigMenuProps["open"];
  anchorEl: DatabaseConfigMenuProps["anchorEl"];
} & ContainerProps;

type ContainerProps = {
  onMenuSelect: DatabaseConfigMenuProps["onClick"];
  menu: DatabaseConfigMenuProps["menu"];
};

const Component = ({
  onOpen,
  onMenuSelect,
  ...delegated
}: Props): JSX.Element | null => {
  return (
    <div>
      <SquareIconButton icon={<SettingsIcon />} onClick={onOpen} />
      <DatabaseConfigMenu {...delegated} onClick={onMenuSelect} />
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

export { Container as DatabaseConfigButton };
export type { ContainerProps as DatabaseConfigButtonProps };
